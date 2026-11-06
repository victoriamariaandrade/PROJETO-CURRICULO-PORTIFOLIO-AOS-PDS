import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme';

import { AppText } from './AppText';
import { Card } from './Card';
import { FadeInView } from './FadeInView';

interface TimelineItemProps {
  title: string;
  subtitle: string;
  /** Linha de contexto acima do título (ex.: tipo de formação). */
  eyebrow?: string;
  period: string;
  badge?: ReactNode;
  description?: string;
  footer?: ReactNode;
  /** Item em andamento: o marcador fica preenchido e pulsa. */
  active?: boolean;
  isLast?: boolean;
  index?: number;
}

const DOT_SIZE = 14;
const RAIL_WIDTH = 22;

function TimelineDot({ active }: { active: boolean }) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (!active || reduceMotion) return;
    pulse.set(withRepeat(withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }), -1));
    return () => cancelAnimation(pulse);
  }, [active, reduceMotion, pulse]);

  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.45 * (1 - pulse.get()),
    transform: [{ scale: 1 + pulse.get() * 1.4 }],
  }));

  return (
    <View style={styles.dotWrapper}>
      {active ? (
        <Animated.View style={[styles.halo, { backgroundColor: colors.primary }, haloStyle]} />
      ) : null}
      <View
        style={[
          styles.dot,
          {
            borderColor: colors.primary,
            backgroundColor: active ? colors.primary : colors.background,
          },
        ]}
      />
    </View>
  );
}

export function TimelineItem({
  title,
  subtitle,
  eyebrow,
  period,
  badge,
  description,
  footer,
  active = false,
  isLast = false,
  index = 0,
}: TimelineItemProps) {
  const { colors, spacing } = useTheme();

  return (
    <FadeInView index={index} style={[styles.row, { gap: spacing.md }]}>
      <View style={[styles.rail, { width: RAIL_WIDTH }]}>
        <TimelineDot active={active} />
        {!isLast ? <View style={[styles.line, { backgroundColor: colors.timeline }]} /> : null}
      </View>

      <View style={[styles.content, { paddingBottom: isLast ? 0 : spacing.xl }]}>
        <Card style={{ gap: spacing.sm }}>
          <View style={[styles.headerRow, { gap: spacing.sm }]}>
            <AppText variant="caption" tone="subtle" style={styles.period}>
              {period}
            </AppText>
            {badge}
          </View>
          <View style={{ gap: spacing.xxs }}>
            {eyebrow ? (
              <AppText variant="overline" tone="primary">
                {eyebrow}
              </AppText>
            ) : null}
            <AppText variant="heading">{title}</AppText>
            <AppText variant="label" tone="muted">
              {subtitle}
            </AppText>
          </View>
          {description ? (
            <AppText variant="bodySmall" tone="muted">
              {description}
            </AppText>
          ) : null}
          {footer ? <View style={{ marginTop: spacing.xs }}>{footer}</View> : null}
        </Card>
      </View>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rail: {
    alignItems: 'center',
    paddingTop: 20,
  },
  dotWrapper: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 3,
  },
  halo: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  line: {
    flex: 1,
    width: 2,
    marginTop: 6,
    marginBottom: -14,
    borderRadius: 1,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  period: {
    flexShrink: 1,
  },
});
