import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useAppTheme } from '@/theme';
import { selectionFeedback } from '@/utils/haptics';

import { PressableScale } from './PressableScale';

/** Botão sol/lua do cabeçalho: alterna entre claro e escuro com o ícone girando. */
export function ThemeToggleButton() {
  const { theme, toggleScheme } = useAppTheme();
  const { colors, radii, spacing } = theme;
  const isDark = theme.scheme === 'dark';
  const rotation = useSharedValue(isDark ? 1 : 0);

  useEffect(() => {
    rotation.set(withSpring(isDark ? 1 : 0, { damping: 12, stiffness: 140 }));
  }, [isDark, rotation]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.get() * 360}deg` }, { scale: 1 - Math.sin(rotation.get() * Math.PI) * 0.25 }],
  }));

  return (
    <PressableScale
      haptic={false}
      onPress={() => {
        selectionFeedback();
        toggleScheme();
      }}
      hitSlop={8}
      accessibilityLabel={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      style={[
        styles.button,
        {
          backgroundColor: colors.surfaceAlt,
          borderColor: colors.border,
          borderRadius: radii.pill,
          marginRight: spacing.lg,
        },
      ]}
    >
      <Animated.View style={iconStyle}>
        <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={colors.primary} />
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
