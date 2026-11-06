import { useWindowDimensions } from 'react-native';

import { layout } from '@/theme';

export function useResponsive() {
  const { width } = useWindowDimensions();
  const isCompact = width < layout.compactBreakpoint;
  const isWide = width >= layout.wideBreakpoint;

  return {
    width,
    isCompact,
    isWide,
    /** Colunas para grades de cards. */
    columns: isWide ? 3 : 2,
    screenPadding: isCompact ? layout.screenPadding - 4 : layout.screenPadding,
  };
}
