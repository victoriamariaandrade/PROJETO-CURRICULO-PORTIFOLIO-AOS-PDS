import * as SystemUI from 'expo-system-ui';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { loadThemeMode, saveThemeMode, type ThemeMode } from './themeStorage';
import {
  createShadows,
  darkColors,
  layout,
  lightColors,
  motion,
  radii,
  spacing,
  typography,
  type ColorScheme,
} from './tokens';

function buildTheme(scheme: ColorScheme) {
  const colors = scheme === 'dark' ? darkColors : lightColors;
  return {
    scheme,
    colors,
    spacing,
    radii,
    typography,
    layout,
    motion,
    shadows: createShadows(colors.shadow),
  };
}

export type Theme = ReturnType<typeof buildTheme>;

interface ThemeContextValue {
  theme: Theme;
  /** Preferência escolhida: segue o sistema ou força claro/escuro. */
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleScheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveScheme(mode: ThemeMode, system: string | null | undefined): ColorScheme {
  if (mode !== 'system') return mode;
  return system === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const reduceMotion = useReducedMotion();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [hydrated, setHydrated] = useState(false);

  const scheme = resolveScheme(mode, systemScheme);
  const theme = useMemo(() => buildTheme(scheme), [scheme]);

  // Transição "fade through": uma camada com a cor de fundo anterior cobre a tela,
  // o tema é trocado por baixo e a camada se dissolve revelando o novo visual.
  const overlayOpacity = useSharedValue(0);
  const [overlayColor, setOverlayColor] = useState(theme.colors.background);
  const transitioning = useRef(false);

  useEffect(() => {
    let active = true;
    loadThemeMode().then((stored) => {
      if (!active) return;
      if (stored) setModeState(stored);
      setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background).catch(() => undefined);
  }, [theme.colors.background]);

  const endTransition = useCallback(() => {
    transitioning.current = false;
  }, []);

  useEffect(() => {
    if (!transitioning.current) return;
    overlayOpacity.set(
      withTiming(0, { duration: motion.themeFadeOut }, () => {
        scheduleOnRN(endTransition);
      }),
    );
  }, [scheme, overlayOpacity, endTransition]);

  const commitMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    void saveThemeMode(next);
  }, []);

  const setMode = useCallback(
    (next: ThemeMode) => {
      if (next === mode || transitioning.current) return;

      const changesScheme = resolveScheme(next, systemScheme) !== scheme;
      if (!changesScheme || reduceMotion) {
        commitMode(next);
        return;
      }

      transitioning.current = true;
      setOverlayColor(theme.colors.background);
      overlayOpacity.set(
        withTiming(1, { duration: motion.themeFadeIn }, () => {
          scheduleOnRN(commitMode, next);
        }),
      );
    },
    [mode, systemScheme, scheme, reduceMotion, commitMode, theme.colors.background, overlayOpacity],
  );

  const toggleScheme = useCallback(() => {
    setMode(scheme === 'dark' ? 'light' : 'dark');
  }, [scheme, setMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, mode, setMode, toggleScheme }),
    [theme, mode, setMode, toggleScheme],
  );

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.get() }));

  if (!hydrated) {
    // Evita "piscar" o tema errado enquanto a preferência salva é carregada.
    return <View style={[styles.fill, { backgroundColor: theme.colors.background }]} />;
  }

  return (
    <ThemeContext.Provider value={value}>
      <View style={[styles.fill, { backgroundColor: theme.colors.background }]}>
        {children}
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: overlayColor }, overlayStyle]}
        />
      </View>
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme deve ser usado dentro de <ThemeProvider>.');
  }
  return context;
}

/** Atalho para quando o componente só precisa dos tokens do tema atual. */
export function useTheme(): Theme {
  return useAppTheme().theme;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
