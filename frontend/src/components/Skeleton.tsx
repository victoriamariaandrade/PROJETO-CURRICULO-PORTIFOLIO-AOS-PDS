import { useEffect } from 'react';
import { StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

/** Bloco com pulso suave usado como placeholder enquanto os dados carregam. */
export function Skeleton({ width = '100%', height = 14, radius, style }: SkeletonProps) {
  const { colors, radii } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.set(
      withRepeat(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }), -1, true),
    );
    return () => cancelAnimation(progress);
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.get(),
      [0, 1],
      [colors.skeleton, colors.skeletonHighlight],
    ),
  }));

  return (
    <Animated.View
      style={[{ width, height, borderRadius: radius ?? radii.sm }, animatedStyle, style]}
    />
  );
}

function SkeletonCard({ lines = 3, withIcon = false }: { lines?: number; withIcon?: boolean }) {
  const { colors, radii, spacing } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radii.lg,
          padding: spacing.lg,
          gap: spacing.md,
        },
      ]}
    >
      <View style={[styles.row, { gap: spacing.md }]}>
        {withIcon ? <Skeleton width={40} height={40} radius={radii.md} /> : null}
        <View style={[styles.flex, { gap: spacing.sm }]}>
          <Skeleton width="65%" height={16} />
          <Skeleton width="40%" height={12} />
        </View>
      </View>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} width={index === lines - 1 ? '70%' : '100%'} height={12} />
      ))}
    </View>
  );
}

interface SkeletonListProps {
  count?: number;
  variant?: 'card' | 'timeline';
}

export function SkeletonList({ count = 3, variant = 'card' }: SkeletonListProps) {
  const { spacing, radii } = useTheme();
  return (
    <View
      style={{ gap: spacing.lg }}
      accessibilityRole="progressbar"
      accessibilityLabel="Carregando conteúdo"
    >
      {Array.from({ length: count }, (_, index) =>
        variant === 'timeline' ? (
          <View key={index} style={[styles.row, { gap: spacing.md }]}>
            <Skeleton width={16} height={16} radius={radii.pill} style={{ marginTop: spacing.lg }} />
            <View style={styles.flex}>
              <SkeletonCard lines={2} />
            </View>
          </View>
        ) : (
          <SkeletonCard key={index} withIcon />
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  flex: {
    flex: 1,
  },
});
