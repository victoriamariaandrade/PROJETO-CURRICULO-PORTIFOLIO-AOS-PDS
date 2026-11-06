import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const supported = Platform.OS === 'ios' || Platform.OS === 'android';

/** Feedback háptico leve para toques em cards e botões. */
export function tapFeedback(): void {
  if (!supported) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
}

/** Feedback de seleção, usado em trocas de estado (tema, item do menu). */
export function selectionFeedback(): void {
  if (!supported) return;
  Haptics.selectionAsync().catch(() => undefined);
}
