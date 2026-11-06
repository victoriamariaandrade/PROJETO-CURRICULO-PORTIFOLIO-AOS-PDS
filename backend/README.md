# API de Currículos — Back-end

API REST que armazena e serve os currículos exibidos pelo app Expo em [`../frontend`](../frontend). Permite consultar, cadastrar, atualizar e excluir as informações curriculares de várias pessoas.

```
App Expo/React Native  →  API REST Express (Vercel)  →  PostgreSQL (NeonDB)
```

O app nunca acessa o banco diretamente: a connection string fica só nas variáveis de ambiente do servidor.

## Tecnologias

| Pacote | Uso |
| --- | --- |
| Node.js 20+ (ES Modules) | Runtime |
| Express 5 | Rotas, middlewares e tratamento de erros (inclusive de funções `async`) |
| pg (node-postgres) | Conexão com o PostgreSQL, com pool e consultas parametrizadas |
| cors | Libera o acesso a partir do app web/Expo |
| dotenv | Lê o arquivo `.env` em desenvolvimento |
| NeonDB | PostgreSQL gerenciado na nuvem |
| Vercel | Hospedagem da API como função serverless |
| Postman | Testes e documentação dos endpoints |

## Estrutura

```
backend/
├── src/
│   ├── app.js              # App Express (exportado: a Vercel usa este arquivo)
│   ├── server.js           # app.listen() para desenvolvimento local
│   ├── config/             # env.js (variáveis) e database.js (pool, query, transações)
│   ├── routes/             # Endpoints → controllers
│   ├── controllers/        # Lê a requisição, valida e monta a resposta HTTP
│   ├── services/           # Regras de negócio (ex.: datas coerentes, 404, transações)
│   ├── repositories/       # SQL parametrizado; converte snake_case → camelCase
│   ├── validators/         # Validação e normalização do corpo das requisições
│   ├── middlewares/        # Erros, rota inexistente e chave de API
│   └── utils/              # HttpError e parse de parâmetros
├── db/
│   ├── migrations/         # Schema do banco (001_create_schema.sql, 002_...)
│   ├── seeds/              # Dois currículos completos (001_curriculos.sql)
│   ├── migrate.js          # npm run db:migrate
│   └── seed.js             # npm run db:seed
├── postman/                # Coleção e environments do Postman (local e produção)
├── bruno/                  # Mesma coleção no formato do Bruno (.bru)
├── .env.example
├── docker-compose.yml  # PostgreSQL local (desenvolvimento)
├── vercel.json
└── package.json
```

Fluxo de uma requisição: `routes → controllers → validators → services → repositories → PostgreSQL`.

## Modelo de dados

```mermaid
erDiagram
  people ||--o{ interests : tem
  people ||--o{ contacts : tem
  people ||--o{ education : tem
  people ||--o{ experiences : tem
  people ||--o{ projects : tem
  people ||--o{ skill_categories : tem
  experiences ||--o{ experience_technologies : usa
  projects ||--o{ project_technologies : usa
  skill_categories ||--o{ skills : agrupa
  technologies ||--o{ experience_technologies : ""
  technologies ||--o{ project_technologies : ""
  technologies ||--o{ skills : ""
```

- **1:N** — cada pessoa tem interesses, contatos, formações, experiências, projetos e categorias de habilidades. Excluir a pessoa remove tudo em cascata (`ON DELETE CASCADE`).
- **N:N** — `technologies` é um catálogo compartilhado, ligado a experiências, projetos e categorias de habilidades por tabelas de associação que guardam a ordem de exibição (`position`). Uma tecnologia em uso não pode ser excluída (`ON DELETE RESTRICT`).
- **Regras no banco** — `CHECK` para tipos de contato, status da formação, datas e anos coerentes; `UNIQUE` para slug da pessoa e nome da tecnologia (sem diferenciar maiúsculas/minúsculas); `updated_at` atualizado por trigger.

## Configuração

### 1. Banco no NeonDB

1. Crie um projeto em [neon.tech](https://neon.tech).
2. Em **Dashboard → Connect**, copie a connection string **pooled** (o host contém `-pooler`).

### Alternativa: PostgreSQL local com Docker

Para desenvolver sem o Neon, o `docker-compose.yml` sobe um PostgreSQL 17 com os dados num volume persistente:

```bash
npm run db:up      # docker compose up -d --wait
npm run db:down    # para o contêiner (os dados continuam no volume)
```

Nesse caso, use no `.env`: `DATABASE_URL=postgresql://curriculo:curriculo@localhost:5432/curriculo`.

### 2. Variáveis de ambiente

```bash
cd backend
cp .env.example .env
```

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `DATABASE_URL` | sim | Connection string do Neon (`...?sslmode=require&channel_binding=require`) |
| `PORT` | não | Porta local (padrão `3000`) |
| `API_KEY` | não | Se definida, `POST`/`PUT`/`PATCH`/`DELETE` exigem o header `x-api-key`. Leituras continuam públicas. |
| `CORS_ORIGIN` | não | Origens permitidas, separadas por vírgula (padrão `*`) |

O `.env` está no `.gitignore` e nunca deve ir para o GitHub.

### 3. Instalar, criar as tabelas e popular

```bash
npm install
npm run db:migrate   # cria as tabelas (só aplica migrations pendentes)
npm run db:seed      # APAGA os dados atuais e cadastra os dois currículos de exemplo
# ou, de uma vez: npm run db:setup
```

O seed cadastra duas pessoas:

- **Victória Maria Beltrão de Andrade** (`victoria-andrade`): dados reais do currículo, com interesses, formação, 6 projetos (com parceiro) e 16 tecnologias em 7 categorias. Ainda não tem contatos nem experiências profissionais; cadastre-os pela API quando houver.
- **Lucas Henrique Ferreira** (`lucas-ferreira`): currículo fictício e completo, usado como segunda pessoa.

### 4. Rodar localmente

```bash
npm run dev    # reinicia ao salvar
# ou: npm start
```

Teste: <http://localhost:3000/api/health> deve responder `{"data":{"status":"ok","database":"up",...}}`.

## Endpoints

Base: `/api`. `:person` aceita o **ID numérico ou o slug** da pessoa (ex.: `/api/people/victoria-andrade`).

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api/health` | Status da API e do banco |
| GET | `/api/people` | Lista as pessoas |
| POST | `/api/people` | Cadastra uma pessoa |
| GET | `/api/people/:person` | Perfil com contatos |
| PUT / PATCH | `/api/people/:person` | Substitui / atualiza parcialmente |
| DELETE | `/api/people/:person` | Exclui a pessoa e todo o currículo |
| GET | `/api/people/:person/resume` | Currículo completo em uma resposta |
| GET / POST | `/api/people/:person/contacts` | Lista / cria contatos |
| GET / POST | `/api/people/:person/education` | Lista / cria formações |
| GET / POST | `/api/people/:person/experiences` | Lista / cria experiências |
| GET / POST | `/api/people/:person/projects` | Lista / cria projetos |
| GET / POST | `/api/people/:person/skill-categories` | Lista / cria categorias de habilidades |
| GET / PUT / PATCH / DELETE | `/api/contacts/:id` | Um contato |
| GET / PUT / PATCH / DELETE | `/api/education/:id` | Uma formação |
| GET / PUT / PATCH / DELETE | `/api/experiences/:id` | Uma experiência |
| GET / PUT / PATCH / DELETE | `/api/projects/:id` | Um projeto |
| GET / PUT / PATCH / DELETE | `/api/skill-categories/:id` | Uma categoria de habilidades |
| GET / POST | `/api/technologies` | Catálogo de tecnologias (com contagem de uso) |
| GET / PUT / PATCH / DELETE | `/api/technologies/:id` | Uma tecnologia |

`PUT` exige o objeto completo (opcionais ausentes viram `null`); `PATCH` altera só os campos enviados.

### Exemplos de corpo

```jsonc
// POST /api/people  (headline, location, avatarUrl e interests são opcionais)
{ "slug": "maria-silva", "name": "Maria Silva", "role": "Desenvolvedora Mobile",
  "headline": "React Native e Expo", "summary": "…", "location": "Recife, PE", "avatarUrl": null,
  "interests": ["Mobile", "Acessibilidade"] }

// POST /api/people/maria-silva/projects  (category, partner, icon e repositoryUrl são opcionais)
{ "name": "Study Flow", "description": "…", "partner": "Projeto acadêmico",
  "icon": "checkbox-outline", "technologies": ["React Native"] }

// POST /api/people/maria-silva/experiences
{ "role": "Desenvolvedora Mobile", "company": "ACME", "startDate": "2024-03-01", "endDate": null,
  "description": "…", "technologies": ["React Native", "Expo", "TypeScript"] }

// POST /api/people/maria-silva/education  (status: "completed" | "in-progress"; startYear é opcional)
{ "degree": "Bacharelado", "course": "Ciência da Computação", "institution": "UFPE",
  "startYear": 2020, "endYear": 2024, "status": "completed", "description": null }

// POST /api/people/maria-silva/skill-categories
{ "name": "Mobile", "icon": "phone-portrait-outline", "skills": ["React Native", "Expo"], "displayOrder": 1 }
```

Nas listas de `technologies` e `skills`, nomes que ainda não existem são criados no catálogo; repetidos são ignorados. A gravação da entidade e dos vínculos acontece numa única transação.

### Formato das respostas

| Situação | Status | Corpo |
| --- | --- | --- |
| Sucesso | 200 | `{ "data": … }` |
| Criado | 201 | `{ "data": … }` + header `Location` |
| Excluído | 204 | (vazio) |
| Dados inválidos | 400 | `{ "error": { "status": 400, "message": "Dados inválidos.", "details": [{ "field", "message" }] } }` |
| Sem chave de API | 401 | `{ "error": { … } }` |
| Não encontrado | 404 | `{ "error": { … } }` |
| Duplicado / em uso | 409 | `{ "error": { … } }` |

## Postman

Importe no Postman:

- `postman/curriculum-api.postman_collection.json`
- `postman/environments/local.postman_environment.json` (`http://localhost:3000`)
- `postman/environments/production.postman_environment.json` (troque `baseUrl` pela URL da Vercel)

A coleção tem 60 requisições com testes automáticos. Rodando-a inteira no **Collection Runner**, ela cria uma pessoa de teste, exercita o CRUD de todas as entidades e os casos de erro (400, 404, 409) e remove a pessoa no final, deixando os dados do seed intactos. Se a API tiver `API_KEY`, preencha a variável `apiKey` do environment.

Também dá para rodar pelo terminal com o Newman:

```bash
npx newman run postman/curriculum-api.postman_collection.json \
  -e postman/environments/local.postman_environment.json
```

## Bruno

A pasta `bruno/` tem a mesma coleção (60 requisições com testes) no formato nativo do [Bruno](https://www.usebruno.com), em arquivos `.bru` versionados junto com o código.

1. No Bruno, **Open Collection** e selecione a pasta `backend/bruno`.
2. No seletor de environment (canto superior direito), escolha **Local** ou **Producao** (troque `baseUrl` pela URL da Vercel).
3. Para rodar tudo, clique com o botão direito na coleção e use **Run**. As pastas são numeradas para rodar na ordem certa: cria a pessoa de teste, exercita o CRUD e os erros, e a remove no final.

Se a API tiver `API_KEY`, preencha `apiKey` no environment; o header `x-api-key` é enviado em todas as requisições.

Pelo terminal, com o CLI do Bruno:

```bash
cd bruno
npx @usebruno/cli run -r --env Local
```

As tecnologias novas usadas nos testes (ex.: Kotlin) ficam no catálogo depois da execução, já que o catálogo é compartilhado; dá para removê-las em `DELETE /api/technologies/:id`.

## Deploy na Vercel

A Vercel detecta o Express automaticamente: `src/app.js` exporta o app, que vira uma função serverless.

1. Envie o repositório para o GitHub.
2. Na Vercel, **Add New → Project**, importe o repositório e defina **Root Directory = `backend`**.
3. Em **Settings → Environment Variables**, cadastre `DATABASE_URL` (e, se quiser, `API_KEY` e `CORS_ORIGIN`).
4. Faça o deploy e teste `https://SEU-PROJETO.vercel.app/api/health`.

As migrations e o seed rodam da sua máquina, apontando o `.env` para o mesmo banco do Neon.

## Segurança

- Credenciais só em variáveis de ambiente (`.env` local e painel da Vercel).
- Todas as consultas são parametrizadas (`$1, $2…`), sem concatenar valores do usuário no SQL.
- Corpo limitado a 100 kB; campos validados e normalizados antes de chegar ao banco.
- Em produção, erros inesperados respondem só "Erro interno do servidor."; o detalhe fica no log.
- `API_KEY` opcional protege as rotas de escrita sem exigir login no app.
