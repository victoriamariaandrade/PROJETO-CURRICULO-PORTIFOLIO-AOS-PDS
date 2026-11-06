import { useIsFocused } from 'expo-router';
import { useState } from 'react';

/**
 * Conta quantas vezes a tela ganhou foco. Usado como `key` para remontar o conteúdo
 * e repetir as animações de entrada sempre que o usuário volta à tela.
 */
export function useFocusCount(): number {
  const isFocused = useIsFocused();
  const [state, setState] = useState({ focused: isFocused, count: 0 });

  if (state.focused !== isFocused) {
    setState({ focused: isFocused, count: isFocused ? state.count + 1 : state.count });
  }

  return state.count;
}
