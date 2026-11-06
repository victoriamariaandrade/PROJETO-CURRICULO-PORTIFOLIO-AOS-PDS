import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { AppText } from './AppText';

interface StatTileProps {
  value: string;
  label: string;
}

/** Indicador numérico compacto, pensado para ficar sobre o gradiente do cartão principal. */
export function StatTile({ value, label }: StatTileProps) {
  const { radii, spacing } = useTheme();

  return (
    <View
      style={[
        styles.tile,
        { borderRadius: radii.md, paddingVertical: spacing.md, paddingHorizontal: spacing.xs },
      ]}
    >
      <AppText variant="heading" style={styles.value} numberOfLines={1}>
        {value}
      </AppText>
      <AppText variant="caption" style={styles.label} numberOfLines={2}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  value: {
    color: '#FFFFFF',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.82)',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 14,
  },
});
