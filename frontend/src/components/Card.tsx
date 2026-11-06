import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';

import { PressableScale } from './PressableScale';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function Card({ children, style, onPress, accessibilityLabel, accessibilityHint }: CardProps) {
  const { colors, radii, spacing, shadows } = useTheme();

  const cardStyle = [
    styles.base,
    {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radii.lg,
      padding: spacing.lg,
    },
    shadows.sm,
    style,
  ];

  if (onPress) {
    return (
      <PressableScale
        onPress={onPress}
        style={cardStyle}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        {children}
      </PressableScale>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderWidth: StyleSheet.hairlineWidth,
  },
});
