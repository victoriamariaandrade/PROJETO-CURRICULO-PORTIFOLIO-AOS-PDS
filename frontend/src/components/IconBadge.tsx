import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { useTheme } from '@/theme';
import type { IconName } from '@/utils/icons';

interface IconBadgeProps {
  name: IconName;
  size?: number;
  tone?: 'primary' | 'accent';
}

/** Ícone dentro de um quadrado arredondado com fundo suave. */
export function IconBadge({ name, size = 40, tone = 'primary' }: IconBadgeProps) {
  const { colors, radii } = useTheme();
  const color = tone === 'primary' ? colors.primary : colors.accent;
  const background = tone === 'primary' ? colors.primarySoft : colors.accentSoft;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radii.md,
        backgroundColor: background,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name={name} size={size * 0.5} color={color} />
    </View>
  );
}
