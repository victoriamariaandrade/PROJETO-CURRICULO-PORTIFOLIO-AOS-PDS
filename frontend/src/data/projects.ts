import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'banco-de-sangue',
    name: 'Aplicativo de Banco de Sangue',
    partner: 'Beyond',
    icon: 'water-outline',
    description:
      'Aplicação voltada à gestão e ao incentivo à doação de sangue, facilitando o acesso a informações e a conexão entre potenciais doadores.',
    technologies: [],
  },
  {
    id: 'movetogether',
    name: 'MoveTogether',
    partner: 'Porto Digital',
    icon: 'fitness-outline',
    description:
      'Aplicativo de exercícios físicos que incentiva hábitos saudáveis e a interação entre pessoas por meio de atividades físicas.',
    technologies: [],
  },
  {
    id: 'audiodescricao',
    name: 'Plataforma de Audiodescrição',
    partner: 'TV Globo',
    icon: 'accessibility-outline',
    description:
      'Solução Front-end para organização e formatação de conteúdos audiovisuais com audiodescrição, promovendo acessibilidade digital.',
    technologies: ['Front-end'],
  },
  {
    id: 'escolas-rondonia',
    name: 'Mapeamento de Escolas Públicas de Rondônia',
    partner: 'Universidade Católica de Pernambuco',
    icon: 'map-outline',
    description:
      'Plataforma para armazenamento, organização e visualização de dados cadastrais e geográficos de escolas públicas de Rondônia.',
    technologies: ['Supabase', 'Back-end', 'Front-end'],
  },
  {
    id: 'study-flow',
    name: 'Study Flow',
    partner: 'Projeto acadêmico',
    icon: 'checkbox-outline',
    description:
      'Aplicativo de gerenciamento de estudos, tarefas e atividades acadêmicas, auxiliando na organização e produtividade dos estudantes.',
    technologies: [],
  },
  {
    id: 'biblioteca-virtual',
    name: 'Biblioteca Virtual',
    partner: 'Projeto acadêmico',
    icon: 'library-outline',
    description:
      'Sistema desenvolvido em Java para gerenciamento de livros e organização de acervo virtual, aplicando conceitos de programação orientada a objetos.',
    technologies: ['Java'],
  },
];
