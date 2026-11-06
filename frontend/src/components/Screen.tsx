import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFocusCount, useResponsive } from '@/hooks';
import { useTheme } from '@/theme';

interface ScreenProps {
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
}

/**
 * Container padrão das telas: rolagem, safe areas, largura máxima em telas grandes
 * e animação de entrada que se repete sempre que a tela volta a ter foco.
 */
export function Screen({ children, refreshing = false, onRefresh }: ScreenProps) {
  const { colors, spacing, layout } = useTheme();
  const insets = useSafeAreaInsets();
  const { screenPadding } = useResponsive();
  const focusCount = useFocusCount();

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: spacing.lg,
        paddingBottom: insets.bottom + spacing.huge,
        paddingLeft: insets.left + screenPadding,
        paddingRight: insets.right + screenPadding,
      }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.surface}
          />
        ) : undefined
      }
    >
      <Animated.View
        key={focusCount}
        entering={FadeIn.duration(260)}
        style={[styles.content, { maxWidth: layout.maxContentWidth, gap: spacing.xxl }]}
      >
        {children}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    width: '100%',
    alignSelf: 'center',
  },
});
