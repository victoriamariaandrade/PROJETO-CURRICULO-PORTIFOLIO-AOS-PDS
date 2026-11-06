#!/usr/bin/env bash
# Configura o projeto inteiro (backend + frontend) em macOS, Linux ou Windows (Git Bash / WSL).
#
#   ./setup.sh              instala dependências, cria os .env, sobe o banco e popula se estiver vazio
#   ./setup.sh --reset-db   idem, mas recria os dados de exemplo (APAGA o que estiver no banco)
#
# Para usar o NeonDB em vez do PostgreSQL local (Docker), informe a connection string:
#   DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require" ./setup.sh
# (só vale na primeira execução; depois, edite backend/.env)

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"
LOCAL_DATABASE_URL="postgresql://curriculo:curriculo@localhost:5432/curriculo"
API_PORT=3000

RESET_DB=false
for arg in "$@"; do
  case "$arg" in
    --reset-db) RESET_DB=true ;;
    -h | --help) sed -n '2,10p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Opção desconhecida: $arg (use --help)"; exit 1 ;;
  esac
done

# ---------------------------------------------------------------------------- saída
if [ -t 1 ]; then
  BOLD=$'\033[1m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; RED=$'\033[31m'; RESET=$'\033[0m'
else
  BOLD=''; GREEN=''; YELLOW=''; RED=''; RESET=''
fi
step() { printf '\n%s==> %s%s\n' "$BOLD" "$1" "$RESET"; }
ok() { printf '%s✔%s %s\n' "$GREEN" "$RESET" "$1"; }
warn() { printf '%s!%s %s\n' "$YELLOW" "$RESET" "$1"; }
fail() { printf '%s✖ %s%s\n' "$RED" "$1" "$RESET" >&2; exit 1; }

case "$(uname -s)" in
  Darwin) OS=mac ;;
  Linux) grep -qi microsoft /proc/version 2>/dev/null && OS=wsl || OS=linux ;;
  MINGW* | MSYS* | CYGWIN*) OS=windows ;;
  *) OS=other ;;
esac

# Lê uma variável de um arquivo .env (KEY=valor), sem executar o arquivo.
read_env() { grep -E "^$1=" "$2" 2>/dev/null | tail -n 1 | cut -d= -f2- || true; }

# ---------------------------------------------------------------------------- pré-requisitos
step "Verificando pré-requisitos ($OS)"

command -v node >/dev/null 2>&1 || fail "Node.js não encontrado. Instale o Node 22 LTS ou 24 LTS: https://nodejs.org"
command -v npm >/dev/null 2>&1 || fail "npm não encontrado (vem junto com o Node.js)."

# React Native 0.88 / Expo SDK 58 exigem Node ^22.13, ^24.3 ou >= 26.
NODE_VERSION="$(node -p 'process.versions.node')"
node -e '
  const [major, minor] = process.versions.node.split(".").map(Number);
  const supported = (major === 22 && minor >= 13) || (major === 24 && minor >= 3) || major >= 26;
  process.exit(supported ? 0 : 1);
' || fail "Node $NODE_VERSION não é suportado. Use Node 22.13+ (LTS) ou 24.3+: https://nodejs.org"
ok "Node $NODE_VERSION e npm $(npm -v)"

# ---------------------------------------------------------------------------- backend/.env
step "Configurando backend/.env"

if [ -f "$BACKEND/.env" ]; then
  ok "backend/.env já existe (mantido)"
else
  DB_URL="${DATABASE_URL:-$LOCAL_DATABASE_URL}"
  cat > "$BACKEND/.env" <<EOF
# Gerado pelo setup.sh. Para usar o Neon, troque pela connection string pooled dele.
DATABASE_URL=$DB_URL

PORT=$API_PORT

# Opcional: se definida, POST/PUT/PATCH/DELETE exigem o header "x-api-key".
API_KEY=

CORS_ORIGIN=*
EOF
  ok "backend/.env criado"
fi

DB_URL="$(read_env DATABASE_URL "$BACKEND/.env")"
[ -n "$DB_URL" ] || fail "DATABASE_URL está vazia em backend/.env."

# Só sobe o Docker quando a URL aponta para o PostgreSQL do docker-compose (porta 5432 local).
case "$DB_URL" in
  *@localhost:5432/* | *@127.0.0.1:5432/*) USE_DOCKER=true; ok "Banco: PostgreSQL local (Docker)" ;;
  *) USE_DOCKER=false; ok "Banco: ${DB_URL##*@}" ;;
esac

# ---------------------------------------------------------------------------- dependências
step "Instalando dependências do backend"
(cd "$BACKEND" && npm install --no-audit --no-fund --loglevel=error)
ok "backend/node_modules pronto"

step "Instalando dependências do frontend (pode levar alguns minutos)"
(cd "$FRONTEND" && npm install --no-audit --no-fund --loglevel=error)
ok "frontend/node_modules pronto"

# ---------------------------------------------------------------------------- banco local
start_docker_daemon() {
  case "$OS" in
    mac) open -a Docker >/dev/null 2>&1 || return 1 ;;
    windows | wsl)
      local exe="/c/Program Files/Docker/Docker/Docker Desktop.exe"
      [ "$OS" = wsl ] && exe="/mnt/c/Program Files/Docker/Docker/Docker Desktop.exe"
      [ -f "$exe" ] || return 1
      "$exe" >/dev/null 2>&1 &
      ;;
    *) return 1 ;;
  esac

  printf 'Aguardando o Docker iniciar'
  for _ in $(seq 1 90); do
    if docker info >/dev/null 2>&1; then echo; return 0; fi
    printf '.'
    sleep 2
  done
  echo
  return 1
}

if [ "$USE_DOCKER" = true ]; then
  step "Subindo o PostgreSQL local (Docker)"

  command -v docker >/dev/null 2>&1 ||
    fail "Docker não encontrado. Instale o Docker Desktop (https://www.docker.com/products/docker-desktop) ou use o Neon: DATABASE_URL=\"...\" ./setup.sh"

  if ! docker info >/dev/null 2>&1; then
    warn "Docker instalado, mas parado. Tentando iniciar..."
    start_docker_daemon ||
      fail "Não consegui iniciar o Docker. Abra o Docker Desktop (no Linux: sudo systemctl start docker) e rode ./setup.sh de novo."
  fi

  if docker compose version >/dev/null 2>&1; then
    COMPOSE=(docker compose)
  elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE=(docker-compose)
  else
    fail "Docker Compose não encontrado. Atualize o Docker Desktop."
  fi

  (cd "$BACKEND" && "${COMPOSE[@]}" up -d) ||
    fail "Não foi possível subir o PostgreSQL. A porta 5432 pode estar em uso por outro banco."

  printf 'Aguardando o banco aceitar conexões'
  for _ in $(seq 1 30); do
    if docker exec curriculo-postgres pg_isready -U curriculo -d curriculo >/dev/null 2>&1; then
      echo
      break
    fi
    printf '.'
    sleep 2
  done
  docker exec curriculo-postgres pg_isready -U curriculo -d curriculo >/dev/null 2>&1 ||
    fail "O PostgreSQL não ficou pronto a tempo. Veja os logs: cd backend && docker compose logs db"
  ok "PostgreSQL rodando em localhost:5432"
fi

# ---------------------------------------------------------------------------- tabelas e dados
step "Criando as tabelas e populando o banco"
(cd "$BACKEND" && node db/migrate.js) || fail "Falha nas migrations. Confira a DATABASE_URL em backend/.env."

if [ "$RESET_DB" = true ]; then
  warn "--reset-db: recriando os dados de exemplo (os dados atuais serão apagados)"
  (cd "$BACKEND" && node db/seed.js)
else
  (cd "$BACKEND" && node db/seed.js --if-empty)
fi

PEOPLE="$(cd "$BACKEND" && node --input-type=module -e "
  import { pool } from './src/config/database.js';
  const { rows } = await pool.query('SELECT name FROM people ORDER BY id');
  console.log(rows.map((row) => row.name).join(', '));
  await pool.end();
")"
ok "Pessoas no banco: ${PEOPLE:-nenhuma}"

# ---------------------------------------------------------------------------- frontend/.env.local
step "Configurando frontend/.env.local"

# IP da máquina na rede local, para o celular (Expo Go) alcançar a API.
LAN_IP="$(node -e '
  const nets = Object.values(require("os").networkInterfaces()).flat();
  const ipv4 = nets.filter((n) => n && n.family === "IPv4" && !n.internal).map((n) => n.address);
  const preferred = ipv4.find((ip) => /^(192\.168|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip));
  console.log(preferred || ipv4[0] || "localhost");
')"
API_URL="http://$LAN_IP:$API_PORT"

if [ -f "$FRONTEND/.env.local" ]; then
  CURRENT_URL="$(read_env EXPO_PUBLIC_API_URL "$FRONTEND/.env.local")"
  ok "frontend/.env.local já existe (mantido): EXPO_PUBLIC_API_URL=$CURRENT_URL"
  case "$CURRENT_URL" in
    *localhost* | *127.0.0.1* | "$API_URL" | https://*) ;;
    *) warn "Seu IP atual é $LAN_IP. Se trocou de rede, atualize EXPO_PUBLIC_API_URL para $API_URL" ;;
  esac
else
  cat > "$FRONTEND/.env.local" <<EOF
# Gerado pelo setup.sh. Reinicie com \`npx expo start --clear\` após mudar.

EXPO_PUBLIC_DATA_SOURCE=api

# IP desta máquina na rede local: funciona no celular (Expo Go), no emulador e no navegador.
# Se trocar de rede Wi-Fi, o IP muda: rode ./setup.sh de novo para ver o IP atual.
EXPO_PUBLIC_API_URL=$API_URL

EXPO_PUBLIC_PERSON=victoria-andrade
EOF
  ok "frontend/.env.local criado (EXPO_PUBLIC_API_URL=$API_URL)"
fi

# ---------------------------------------------------------------------------- pronto
cat <<EOF

${GREEN}${BOLD}Tudo pronto!${RESET} Rode em dois terminais:

  ${BOLD}1) API${RESET}                       ${BOLD}2) App${RESET}
     cd backend                    cd frontend
     npm run dev                   npx expo start --clear

  API:    http://localhost:$API_PORT/api/health
  App:    escaneie o QR code com o Expo Go (mesma rede Wi-Fi) ou aperte "w" para o navegador
EOF
if [ "$USE_DOCKER" = true ]; then
  printf '  Banco:  parar com "cd backend && npm run db:down"; subir de novo com "npm run db:up"\n'
fi
