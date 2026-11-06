import type { ReactNode } from 'react';
import {
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { motion } from '@/theme';
import { tapFeedback } from '@/utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SPRING = { damping: 18, stiffness: 320, mass: 0.6 };

export interface PressableScaleProps extends Omit<PressableProps, 'style' | 'children'> {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Escala aplicada enquanto o dedo está pressionado. */
  scaleTo?: number;
  haptic?: boolean;
}

/** Pressable com "afundamento" animado e feedback háptico opcional. */
export function PressableScale({
  children,
  style,
  scaleTo = motion.pressScale,
  haptic = true,
  onPress,
  onPressIn,
  onPressOut,
  ...rest
}: PressableScaleProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pressed.get(), [0, 1], [1, 0.9]),
    transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, scaleTo]) }],
  }));

  const handlePressIn = (event: GestureResponderEvent) => {
    pressed.set(withSpring(1, SPRING));
    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    pressed.set(withSpring(0, SPRING));
    onPressOut?.(event);
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (haptic) tapFeedback();
    onPress?.(event);
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      {...rest}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
