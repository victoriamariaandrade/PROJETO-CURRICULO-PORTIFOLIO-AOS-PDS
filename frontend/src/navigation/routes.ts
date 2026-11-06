import type { Href } from 'expo-router';

import type { IconName } from '@/utils/icons';

export interface AppRoute {
  /** Nome do arquivo da rota em `app/`. */
  name: string;
  href: Href;
  label: string;
  title: string;
  description: string;
  icon: IconName;
  activeIcon: IconName;
}

export const appRoutes: readonly AppRoute[] = [
  {
    name: 'index',
    href: '/',
    label: 'Início',
    title: 'Início',
    description: 'Apresentação e contatos',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    name: 'experiencia',
    href: '/experiencia',
    label: 'Experiência',
    title: 'Experiência profissional',
    description: 'Trajetória e cargos',
    icon: 'briefcase-outline',
    activeIcon: 'briefcase',
  },
  {
    name: 'formacao',
    href: '/formacao',
    label: 'Formação',
    title: 'Experiência acadêmica',
    description: 'Graduação e pós',
    icon: 'school-outline',
    activeIcon: 'school',
  },
  {
    name: 'projetos',
    href: '/projetos',
    label: 'Projetos',
    title: 'Projetos',
    description: 'O que já construí',
    icon: 'rocket-outline',
    activeIcon: 'rocket',
  },
  {
    name: 'tecnologias',
    href: '/tecnologias',
    label: 'Tecnologias',
    title: 'Tecnologias',
    description: 'Stack e ferramentas',
    icon: 'code-slash-outline',
    activeIcon: 'code-slash',
  },
  {
    name: 'sobre',
    href: '/sobre',
    label: 'Sobre o app',
    title: 'Sobre o app',
    description: 'Como este app foi feito',
    icon: 'information-circle-outline',
    activeIcon: 'information-circle',
  },
];

export const sectionRoutes = appRoutes.filter((route) => route.name !== 'index');
