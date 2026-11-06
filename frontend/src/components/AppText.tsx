import { Text, type TextProps } from 'react-native';

import { useTheme, type ThemeColors, type TypographyVariant } from '@/theme';

export type TextTone = 'default' | 'muted' | 'subtle' | 'primary' | 'accent' | 'onPrimary' | 'danger';

const toneToColor: Record<TextTone, keyof ThemeColors> = {
  default: 'text',
  muted: 'textMuted',
  subtle: 'textSubtle',
  primary: 'primary',
  accent: 'accent',
  onPrimary: 'onPrimary',
  danger: 'danger',
};

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  tone?: TextTone;
}

export function AppText({ variant = 'body', tone = 'default', style, ...rest }: AppTextProps) {
  const { colors, typography } = useTheme();
  return (
    <Text {...rest} style={[typography[variant], { color: colors[toneToColor[tone]] as string }, style]} />
  );
}
