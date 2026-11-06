import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Button } from '@/components';
import { useTheme } from '@/theme';

export default function NotFoundScreen() {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, gap: spacing.md, padding: spacing.xxl }]}>
      <AppText variant="title">Página não encontrada</AppText>
      <AppText variant="body" tone="muted" style={styles.center}>
        O endereço acessado não existe neste app.
      </AppText>
      <Button label="Voltar ao início" icon="home-outline" onPress={() => router.replace('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
  },
});
