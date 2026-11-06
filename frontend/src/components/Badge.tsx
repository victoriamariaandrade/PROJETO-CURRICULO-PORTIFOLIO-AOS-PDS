import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';
import type { IconName } from '@/utils/icons';

import { AppText } from './AppText';

interface BadgeProps {
  label: string;
  tone?: 'primary' | 'success' | 'warning';
  icon?: IconName;
}

export function Badge({ label, tone = 'primary', icon }: BadgeProps) {
  const { colors, radii, spacing } = useTheme();

  const palette = {
    primary: { fg: colors.primary, bg: colors.primarySoft },
    success: { fg: colors.success, bg: colors.accentSoft },
    warning: { fg: colors.warning, bg: colors.warningSoft },
  }[tone];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: palette.bg,
          borderRadius: radii.pill,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xxs + 1,
          gap: spacing.xs,
        },
      ]}
    >
      {icon ? <Ionicons name={icon} size={12} color={palette.fg} /> : null}
      <AppText variant="caption" style={{ color: palette.fg, fontWeight: '700' }}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
});
