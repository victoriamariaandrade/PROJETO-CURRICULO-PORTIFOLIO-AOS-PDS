import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';
import type { IconName } from '@/utils/icons';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface ButtonProps {
  label: string;
  onPress: () => void;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
}

export function Button({
  label,
  onPress,
  icon,
  variant = 'primary',
  style,
  accessibilityHint,
}: ButtonProps) {
  const { colors, radii, spacing } = useTheme();

  const palette = {
    primary: { bg: colors.primary, fg: colors.onPrimary, border: colors.primary },
    secondary: { bg: colors.surface, fg: colors.text, border: colors.border },
    ghost: { bg: 'transparent', fg: colors.primary, border: 'transparent' },
  }[variant];

  return (
    <PressableScale
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      style={[
        styles.button,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderRadius: radii.pill,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md - 2,
          gap: spacing.sm,
        },
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={16} color={palette.fg} /> : null}
      <AppText variant="label" style={{ color: palette.fg }}>
        {label}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 44,
  },
});
