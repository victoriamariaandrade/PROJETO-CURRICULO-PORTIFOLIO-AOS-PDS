import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme';
import type { IconName } from '@/utils/icons';

import { AppText } from './AppText';
import { Card } from './Card';
import { IconBadge } from './IconBadge';

interface ShortcutCardProps {
  label: string;
  description: string;
  icon: IconName;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ShortcutCard({ label, description, icon, onPress, style }: ShortcutCardProps) {
  const { colors, spacing } = useTheme();

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityHint={`Abre a seção ${label}`}
      style={[{ gap: spacing.md }, style]}
    >
      <View style={styles.top}>
        <IconBadge name={icon} />
        <Ionicons name="arrow-forward" size={16} color={colors.textSubtle} />
      </View>
      <View style={{ gap: spacing.xxs }}>
        <AppText variant="subtitle" numberOfLines={1}>
          {label}
        </AppText>
        <AppText variant="caption" tone="subtle" numberOfLines={2}>
          {description}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
});
