import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof Ionicons>['name'];

/** Converte um nome vindo dos dados em um ícone válido, com fallback seguro. */
export function resolveIcon(name: string | undefined, fallback: IconName): IconName {
  return name && name in Ionicons.glyphMap ? (name as IconName) : fallback;
}
