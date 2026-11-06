import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { AppText } from './AppText';

interface SectionHeaderProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
}

export function SectionHeader({ title, eyebrow, subtitle }: SectionHeaderProps) {
  const { spacing } = useTheme();

  return (
    <View style={[styles.container, { gap: spacing.xs }]} accessibilityRole="header">
      {eyebrow ? (
        <AppText variant="overline" tone="primary">
          {eyebrow}
        </AppText>
      ) : null}
      <AppText variant="title">{title}</AppText>
      {subtitle ? (
        <AppText variant="body" tone="muted">
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
});
