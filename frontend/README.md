# Portfólio — Victória Maria Beltrão de Andrade

Aplicativo mobile de currículo e portfólio pessoal, feito com **React Native + Expo**. Reúne apresentação, experiência profissional, formação acadêmica, projetos e tecnologias, com navegação por menu lateral, animações e tema claro/escuro.

Os dados vêm de uma API REST própria (diretório [`../backend`](../backend)), com PostgreSQL no NeonDB. Roda direto no **Expo Go**, sem development build.

## Funcionalidades

- **Início**: cartão de apresentação com avatar, cargo, resumo, indicadores (anos de experiência, projetos, tecnologias), links de contato e atalhos para as seções.
- **Experiência profissional**: linha do tempo com cargo, empresa, período, duração calculada até o mês atual, descrição e tecnologias.
- **Experiência acadêmica**: linha do tempo das formações, com status (concluído / em andamento).
- **Projetos**: cards com descrição curta, categoria e tecnologias.
- **Tecnologias**: stack agrupada por categoria.
- **Sobre o app**: tecnologias e bibliotecas usadas no próprio app (com a versão instalada de cada uma), arquitetura de dados e a funcionalidade de tema.
- **Menu lateral (Drawer)** com ícones, item ativo destacado e cabeçalho com gradiente.
- **Animações**: entrada em cascata dos cards e itens da timeline (repetida a cada visita à tela), press states com escala, skeletons pulsantes e marcador animado no item atual da timeline.
- **Feedback háptico** em toques e trocas de tema.
- **Estados de carregamento e erro** em todas as telas, com "puxar para atualizar".
- **Layout responsivo**: safe areas, grade de 2 ou 3 colunas, ajustes para telas compactas e largura máxima em telas grandes.

### Tema claro / escuro

- Botão de sol/lua no cabeçalho e seletor **Claro · Escuro · Sistema** no menu lateral.
- Transição animada: a tela se dissolve na cor de fundo anterior e revela o novo tema; o ícone gira com efeito de mola.
- Preferência persistida com AsyncStorage e restaurada sem "piscar" o tema errado.
- Sem preferência salva, segue o tema do sistema (e acompanha mudanças em tempo real).
- Respeita a configuração de "reduzir movimento" do sistema.

## Tecnologias

| Pacote | Uso |
| --- | --- |
| Expo SDK 58 + React Native 0.88 + React 19 | Base do app |
| TypeScript (strict) | Tipagem |
| Expo Router | Rotas por arquivo e Drawer |
| react-native-reanimated 4 + react-native-worklets | Animações e transições |
| react-native-gesture-handler | Gestos do menu lateral |
| react-native-safe-area-context / react-native-screens | Safe areas e telas nativas |
| expo-linear-gradient | Gradientes |
| @expo/vector-icons (Ionicons) + expo-font | Ícones |
| expo-haptics | Feedback háptico |
| @react-native-async-storage/async-storage | Persistência do tema |
| expo-system-ui / expo-status-bar | Cores nativas da janela e da barra de status |
| expo-linking / expo-constants | Links externos e dados de configuração |
| expo-updates + EAS Update | Atualizações over-the-air |
| ESLint (eslint-config-expo) | Qualidade de código |

## Estrutura de pastas

```
app/                      # Rotas (Expo Router)
  _layout.tsx             # Providers + Drawer
  index.tsx               # Início
  experiencia.tsx
  formacao.tsx
  projetos.tsx
  tecnologias.tsx
  sobre.tsx
  +not-found.tsx
src/
  components/             # Componentes reutilizáveis (Card, TimelineItem, Chip, Skeleton...)
  data/                   # Dados estáticos (fonte static e tela Sobre)
  hooks/                  # useProfile, useProjects... (data / loading / error)
  navigation/             # Configuração dos itens do menu
  services/               # ResumeService, ApiResumeService, StaticResumeService e factory
  theme/                  # Design tokens e ThemeProvider
  types/                  # Tipos do domínio
  utils/                  # Datas, haptics, links, ícones
```

## Como rodar localmente

Você vai precisar do Node.js 20+, do app **Expo Go** no celular e da API do diretório [`../backend`](../backend) no ar (local ou na Vercel).

```bash
npm install
cp .env.example .env.local   # ajuste EXPO_PUBLIC_API_URL
npx expo start
```

Escaneie o QR code com a câmera (iOS) ou com o Expo Go (Android). Também é possível abrir no navegador com `npm run web`.

> No celular ou emulador, `localhost` não aponta para o seu computador. Use o IP da sua rede local (ex.: `http://192.168.0.10:3000`) ou a URL da API na Vercel.

Scripts úteis:

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run doctor      # expo-doctor
```

## Camada de dados

As telas consomem **apenas hooks** (`useProfile`, `useEducation`, `useExperiences`, `useProjects`, `useSkills`). Os hooks usam a interface `ResumeService`, cujos métodos retornam `Promise`:

```ts
interface ResumeService {
  getProfile(): Promise<Profile>;
  getEducation(): Promise<Education[]>;
  getExperiences(): Promise<Experience[]>;
  getProjects(): Promise<Project[]>;
  getSkills(): Promise<SkillCategory[]>;
}
```

| Implementação | Fonte |
| --- | --- |
| `ApiResumeService` (padrão) | API REST do back-end (Express na Vercel + PostgreSQL no NeonDB), via `fetch` |
| `StaticResumeService` | Dados locais de `src/data`, para desenvolver sem rede |

Configuração por variáveis de ambiente (`.env.local`):

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `EXPO_PUBLIC_DATA_SOURCE` | `api` | `api` ou `static` |
| `EXPO_PUBLIC_API_URL` | — | URL base da API, sem barra final |
| `EXPO_PUBLIC_PERSON` | `victoria-andrade` | Slug ou ID da pessoa exibida |

Depois de alterar, reinicie o bundler com `npx expo start --clear`. O app nunca fala com o banco diretamente: a connection string fica só no back-end. Erros de rede ou da API aparecem no estado de erro das telas, com o botão de tentar novamente.

Para adicionar outra fonte, crie a classe em `src/services/` implementando `ResumeService` e registre-a no objeto `factories` de `src/services/createResumeService.ts`. Nenhuma tela precisa ser alterada.

## Publicação com EAS Update

O projeto já tem `expo-updates`, `runtimeVersion` e o `eas.json` com os canais `development`, `preview` e `production`.

1. Em `app.json`, substitua `<ORGANIZACAO_EXPO>` em `owner` pela sua conta ou organização no Expo.
2. Faça login e vincule o projeto (isso grava o `extra.eas.projectId` no `app.json`):
   ```bash
   npx eas-cli@latest login
   npx eas-cli@latest init
   ```
3. Configure o EAS Update (adiciona `updates.url` ao `app.json`):
   ```bash
   npx eas-cli@latest update:configure
   ```
4. Publique uma atualização:
   ```bash
   npm run update:preview -- --message "Primeira versão"
   ```
5. Abra a página da atualização no painel do Expo (link exibido no terminal) e escaneie o QR code com o **Expo Go** para abrir o app.

## Licença

Uso pessoal.
