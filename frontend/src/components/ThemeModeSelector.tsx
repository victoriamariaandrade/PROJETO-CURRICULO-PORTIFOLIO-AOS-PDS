import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useAppTheme, type ThemeMode } from '@/theme';
import { selectionFeedback } from '@/utils/haptics';
import type { IconName } from '@/utils/icons';

import { AppText } from './AppText';

const OPTIONS: { mode: ThemeMode; label: string; icon: IconName }[] = [
  { mode: 'light', label: 'Claro', icon: 'sunny-outline' },
  { mode: 'dark', label: 'Escuro', icon: 'moon-outline' },
  { mode: 'system', label: 'Sistema', icon: 'phone-portrait-outline' },
];

const PADDING = 4;

/** Controle segmentado Claro · Escuro · Sistema com indicador deslizante. */
export function ThemeModeSelector() {
  const { theme, mode, setMode } = useAppTheme();
  const { colors, radii, spacing, shadows } = theme;
  const [segmentWidth, setSegmentWidth] = useState(0);
  const selectedIndex = Math.max(
    0,
    OPTIONS.findIndex((option) => option.mode === mode),
  );
  const offset = useSharedValue(0);
  const positioned = useRef(false);

  useEffect(() => {
    if (segmentWidth === 0) return;
    const target = selectedIndex * segmentWidth;
    // Na primeira medição o indicador já nasce no lugar; depois, desliza com mola.
    offset.set(positioned.current ? withSpring(target, { damping: 20, stiffness: 220 }) : target);
    positioned.current = true;
  }, [selectedIndex, segmentWidth, offset]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.get() }],
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    setSegmentWidth((event.nativeEvent.layout.width - PADDING * 2) / OPTIONS.length);
  };

  return (
    <View
      onLayout={handleLayout}
      accessibilityRole="radiogroup"
      accessibilityLabel="Tema do aplicativo"
      style={[
        styles.track,
        { backgroundColor: colors.surfaceAlt, borderRadius: radii.md, padding: PADDING },
      ]}
    >
      {segmentWidth > 0 ? (
        <Animated.View
          style={[
            styles.indicator,
            {
              width: segmentWidth,
              top: PADDING,
              bottom: PADDING,
              left: PADDING,
              borderRadius: radii.sm,
              backgroundColor: colors.surface,
            },
            shadows.sm,
            indicatorStyle,
          ]}
        />
      ) : null}

      {OPTIONS.map((option) => {
        const selected = option.mode === mode;
        const tint = selected ? colors.primary : colors.textSubtle;
        return (
          <Pressable
            key={option.mode}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`Tema ${option.label.toLowerCase()}`}
            onPress={() => {
              if (selected) return;
              selectionFeedback();
              setMode(option.mode);
            }}
            style={[styles.segment, { paddingVertical: spacing.sm, gap: spacing.xs }]}
          >
            <Ionicons name={option.icon} size={14} color={tint} />
            <AppText variant="caption" style={{ color: tint, fontWeight: selected ? '700' : '500' }}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
  },
  indicator: {
    position: 'absolute',
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
