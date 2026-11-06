import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { motion } from '@/theme';

interface FadeInViewProps {
  children: ReactNode;
  /** Posição na lista: cada item entra um pouco depois do anterior (efeito cascata). */
  index?: number;
  style?: StyleProp<ViewStyle>;
}

export function FadeInView({ children, index = 0, style }: FadeInViewProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * motion.stagger).duration(motion.entranceDuration)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
