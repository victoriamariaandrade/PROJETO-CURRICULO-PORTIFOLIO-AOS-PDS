import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { AppText } from './AppText';

interface ChipProps {
  label: string;
  tone?: 'neutral' | 'primary';
}

export function Chip({ label, tone = 'neutral' }: ChipProps) {
  const { colors, radii, spacing } = useTheme();
  const isPrimary = tone === 'primary';

  return (
    <View
      style={[
        styles.chip,
        {
          borderRadius: radii.pill,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs + 1,
          backgroundColor: isPrimary ? colors.primarySoft : colors.surfaceAlt,
          borderColor: isPrimary ? 'transparent' : colors.border,
        },
      ]}
    >
      <AppText variant="caption" tone={isPrimary ? 'primary' : 'muted'}>
        {label}
      </AppText>
    </View>
  );
}

/** Lista de chips com quebra de linha automática. */
export function ChipList({ items, tone }: { items: string[]; tone?: ChipProps['tone'] }) {
  const { spacing } = useTheme();
  return (
    <View style={[styles.list, { gap: spacing.sm }]}>
      {items.map((item) => (
        <Chip key={item} label={item} tone={tone} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
