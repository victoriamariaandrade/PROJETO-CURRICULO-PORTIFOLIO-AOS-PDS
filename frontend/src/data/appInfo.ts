export interface StackItem {
  name: string;
  /** Pacote npm correspondente, usado para exibir a versão instalada. */
  packageName?: string;
  role: string;
}

export interface StackGroup {
  id: string;
  title: string;
  icon: string;
  items: StackItem[];
}

export interface FeatureHighlight {
  title: string;
  icon: string;
  summary: string;
  details: string[];
}

export const appStack: StackGroup[] = [
  {
    id: 'base',
    title: 'Base',
    icon: 'cube-outline',
    items: [
      {
        name: 'Expo',
        packageName: 'expo',
        role: 'SDK e ferramentas que unificam build, módulos nativos e execução no Expo Go.',
      },
      {
        name: 'React Native',
        packageName: 'react-native',
        role: 'Renderiza componentes nativos de iOS e Android a partir de código React.',
      },
      {
        name: 'React',
        packageName: 'react',
        role: 'Componentes, hooks e Context API usados em toda a interface.',
      },
      {
        name: 'TypeScript',
        packageName: 'typescript',
        role: 'Tipagem estática em modo strict para domínio, serviços e componentes.',
      },
    ],
  },
  {
    id: 'navigation',
    title: 'Navegação',
    icon: 'git-branch-outline',
    items: [
      {
        name: 'Expo Router',
        packageName: 'expo-router',
        role: 'Rotas baseadas em arquivos e o menu lateral (Drawer) com item ativo destacado.',
      },
      {
        name: 'React Native Screens',
        packageName: 'react-native-screens',
        role: 'Containers de tela nativos usados pelo roteador para economizar memória.',
      },
      {
        name: 'Safe Area Context',
        packageName: 'react-native-safe-area-context',
        role: 'Mantém o conteúdo longe do notch, da barra de status e da barra de gestos.',
      },
      {
        name: 'Expo Linking',
        packageName: 'expo-linking',
        role: 'Abre e-mail, GitHub e LinkedIn a partir dos botões de contato.',
      },
      {
        name: 'Expo Constants',
        packageName: 'expo-constants',
        role: 'Lê a configuração do app, como o nome e a versão exibidos nesta tela.',
      },
    ],
  },
  {
    id: 'motion',
    title: 'Animações e gestos',
    icon: 'sparkles-outline',
    items: [
      {
        name: 'Reanimated',
        packageName: 'react-native-reanimated',
        role: 'Entradas em cascata, press states, skeletons e a transição de tema na thread de UI.',
      },
      {
        name: 'React Native Worklets',
        packageName: 'react-native-worklets',
        role: 'Runtime de worklets do Reanimated 4, usado para voltar à thread JS ao fim das animações.',
      },
      {
        name: 'Gesture Handler',
        packageName: 'react-native-gesture-handler',
        role: 'Gestos nativos para abrir e fechar o menu lateral arrastando.',
      },
    ],
  },
  {
    id: 'ui',
    title: 'Interface',
    icon: 'color-palette-outline',
    items: [
      {
        name: 'Expo Vector Icons',
        packageName: '@expo/vector-icons',
        role: 'Ícones Ionicons do menu, dos cards e dos botões.',
      },
      {
        name: 'Expo Font',
        packageName: 'expo-font',
        role: 'Carrega a fonte de ícones usada pelo Expo Vector Icons.',
      },
      {
        name: 'Expo Linear Gradient',
        packageName: 'expo-linear-gradient',
        role: 'Gradientes do cartão de apresentação, do avatar e do topo do menu.',
      },
      {
        name: 'Expo Haptics',
        packageName: 'expo-haptics',
        role: 'Feedback tátil ao tocar em cards, botões e ao trocar o tema.',
      },
      {
        name: 'Expo Status Bar',
        packageName: 'expo-status-bar',
        role: 'Ajusta a cor dos ícones da barra de status ao tema ativo.',
      },
      {
        name: 'Expo System UI',
        packageName: 'expo-system-ui',
        role: 'Sincroniza a cor de fundo da janela nativa com o tema.',
      },
      {
        name: 'React Native Web',
        packageName: 'react-native-web',
        role: 'Permite abrir o mesmo código no navegador durante o desenvolvimento.',
      },
    ],
  },
  {
    id: 'data',
    title: 'Dados e persistência',
    icon: 'server-outline',
    items: [
      {
        name: 'AsyncStorage',
        packageName: '@react-native-async-storage/async-storage',
        role: 'Guarda a preferência de tema para restaurá-la na próxima abertura.',
      },
    ],
  },
  {
    id: 'quality',
    title: 'Qualidade e publicação',
    icon: 'shield-checkmark-outline',
    items: [
      {
        name: 'ESLint',
        packageName: 'eslint-config-expo',
        role: 'Padroniza o código e aplica as regras de hooks e do React Compiler.',
      },
      {
        name: 'Expo Updates',
        packageName: 'expo-updates',
        role: 'Recebe atualizações over-the-air publicadas com o EAS Update.',
      },
      {
        name: 'EAS',
        role: 'Perfis de build e canais de atualização (preview e production) definidos no eas.json.',
      },
    ],
  },
];

export const themeFeature: FeatureHighlight = {
  title: 'Tema claro e escuro',
  icon: 'contrast-outline',
  summary:
    'Todo o app pode alternar entre os temas claro e escuro, com transição animada e preferência salva no aparelho.',
  details: [
    'Botão de sol/lua no cabeçalho de todas as telas e seletor Claro · Escuro · Sistema no menu lateral.',
    'Na troca, a tela se dissolve na cor de fundo anterior e revela o novo tema, enquanto o ícone gira com efeito de mola.',
    'A escolha é persistida com AsyncStorage e restaurada ao abrir o app, sem "piscar" o tema errado.',
    'Sem escolha salva, o app segue o tema do sistema e acompanha mudanças em tempo real.',
    'Com a opção de reduzir movimento ativada no sistema, o tema troca sem animação.',
    'Cores, espaçamentos e tipografia vêm de design tokens; os componentes leem o tema atual via contexto.',
  ],
};

export const architectureNotes: FeatureHighlight = {
  title: 'Camada de dados',
  icon: 'git-network-outline',
  summary:
    'As telas consomem apenas hooks; os hooks falam com uma interface de serviço, e a implementação é escolhida por variável de ambiente.',
  details: [
    'Tipos do domínio em src/types (Profile, Education, Experience, Project, Skill).',
    'ApiResumeService busca o currículo na API REST própria (Node.js + Express), hospedada na Vercel e conectada ao PostgreSQL do NeonDB.',
    'A factory lê EXPO_PUBLIC_DATA_SOURCE (api por padrão); EXPO_PUBLIC_API_URL e EXPO_PUBLIC_PERSON definem o endereço da API e a pessoa exibida.',
    'StaticResumeService continua disponível com dados locais para desenvolver sem rede.',
    'Hooks como useProfile e useProjects expõem data, loading e error, com cache em memória e skeletons durante o carregamento.',
  ],
};
