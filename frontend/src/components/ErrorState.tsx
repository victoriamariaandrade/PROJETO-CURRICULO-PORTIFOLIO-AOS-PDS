import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { AppText } from './AppText';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Não foi possível carregar',
  message = 'Verifique sua conexão e tente novamente.',
  onRetry,
}: ErrorStateProps) {
  const { colors, radii, spacing } = useTheme();

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.lg,
          padding: spacing.xxl,
          gap: spacing.md,
        },
      ]}
    >
      <View
        style={[
          styles.icon,
          { backgroundColor: colors.dangerSoft, borderRadius: radii.pill },
        ]}
      >
        <Ionicons name="cloud-offline-outline" size={26} color={colors.danger} />
      </View>
      <AppText variant="heading" style={styles.center}>
        {title}
      </AppText>
      <AppText variant="bodySmall" tone="muted" style={styles.center}>
        {message}
      </AppText>
      {onRetry ? (
        <Button label="Tentar novamente" icon="refresh" onPress={onRetry} style={{ marginTop: spacing.sm }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
  },
});
