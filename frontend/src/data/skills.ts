import type { Skill, SkillCategory } from '@/types';

const toSkills = (names: string[]): Skill[] =>
  names.map((name) => ({ id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name }));

export const skills: SkillCategory[] = [
  {
    id: 'languages',
    name: 'Linguagens',
    icon: 'code-slash-outline',
    skills: toSkills(['Java', 'JavaScript', 'Python']),
  },
  {
    id: 'mobile',
    name: 'Mobile',
    icon: 'phone-portrait-outline',
    skills: toSkills(['React Native', 'Expo']),
  },
  {
    id: 'frontend',
    name: 'Front-end',
    icon: 'desktop-outline',
    skills: toSkills(['HTML5', 'CSS3']),
  },
  {
    id: 'backend',
    name: 'Back-end',
    icon: 'server-outline',
    skills: toSkills(['Node.js', 'Supabase']),
  },
  {
    id: 'database',
    name: 'Banco de dados',
    icon: 'layers-outline',
    skills: toSkills(['SQL', 'PostgreSQL']),
  },
  {
    id: 'tools',
    name: 'Ferramentas',
    icon: 'construct-outline',
    skills: toSkills(['Git', 'GitHub', 'VS Code']),
  },
  {
    id: 'data',
    name: 'Dados e APIs',
    icon: 'swap-horizontal-outline',
    skills: toSkills(['JSON', 'APIs REST']),
  },
];
