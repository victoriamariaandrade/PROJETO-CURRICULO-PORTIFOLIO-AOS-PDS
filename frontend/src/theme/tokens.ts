import { Platform, type TextStyle, type ViewStyle } from 'react-native';

export type ColorScheme = 'light' | 'dark';

const palette = {
  indigo50: '#EEF0FF',
  indigo100: '#E0E4FF',
  indigo300: '#A5B0FF',
  indigo400: '#8B93FF',
  indigo500: '#5B5FEF',
  indigo600: '#4B4BD8',
  indigo700: '#3B36B5',
  violet500: '#8B5CF6',
  violet700: '#6D28D9',
  teal400: '#2DD4BF',
  teal600: '#0D9488',
  amber400: '#FBBF24',
  amber600: '#D97706',
  rose400: '#FB7185',
  rose600: '#E11D48',
  white: '#FFFFFF',
  slate50: '#F6F7FB',
  slate100: '#EDEFF5',
  slate200: '#E2E5EE',
  slate300: '#CBD0DC',
  slate400: '#99A0B3',
  slate500: '#6B7387',
  slate600: '#4A5266',
  slate800: '#1E2433',
  slate900: '#151A26',
  ink800: '#1A2032',
  ink850: '#141A2A',
  ink900: '#0E1320',
  ink950: '#090D17',
} as const;

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  primary: string;
  primarySoft: string;
  onPrimary: string;
  accent: string;
  accentSoft: string;
  success: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  skeleton: string;
  skeletonHighlight: string;
  timeline: string;
  overlay: string;
  shadow: string;
  gradient: readonly [string, string];
}

export const lightColors: ThemeColors = {
  background: palette.slate50,
  surface: palette.white,
  surfaceAlt: palette.slate100,
  border: palette.slate200,
  text: palette.slate900,
  textMuted: palette.slate600,
  textSubtle: palette.slate500,
  primary: palette.indigo600,
  primarySoft: palette.indigo50,
  onPrimary: palette.white,
  accent: palette.teal600,
  accentSoft: '#E3F7F4',
  success: palette.teal600,
  warning: palette.amber600,
  warningSoft: '#FEF3DC',
  danger: palette.rose600,
  dangerSoft: '#FDE7EC',
  skeleton: palette.slate200,
  skeletonHighlight: palette.slate100,
  timeline: palette.indigo100,
  overlay: 'rgba(15, 18, 30, 0.45)',
  shadow: '#1B2140',
  gradient: [palette.indigo600, palette.violet500],
};

export const darkColors: ThemeColors = {
  background: palette.ink950,
  surface: palette.ink850,
  surfaceAlt: palette.ink800,
  border: '#252D42',
  text: '#EEF0F7',
  textMuted: '#B4BACB',
  textSubtle: '#8A91A6',
  primary: palette.indigo400,
  primarySoft: 'rgba(139, 147, 255, 0.14)',
  onPrimary: palette.ink950,
  accent: palette.teal400,
  accentSoft: 'rgba(45, 212, 191, 0.14)',
  success: palette.teal400,
  warning: palette.amber400,
  warningSoft: 'rgba(251, 191, 36, 0.14)',
  danger: palette.rose400,
  dangerSoft: 'rgba(251, 113, 133, 0.14)',
  skeleton: '#232B40',
  skeletonHighlight: '#2F3954',
  timeline: '#2A3352',
  overlay: 'rgba(0, 0, 0, 0.6)',
  shadow: '#000000',
  gradient: [palette.indigo700, palette.violet700],
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const layout = {
  /** Largura máxima do conteúdo em telas largas (tablets / celulares em paisagem). */
  maxContentWidth: 720,
  screenPadding: spacing.xl,
  compactBreakpoint: 360,
  wideBreakpoint: 600,
} as const;

export const typography = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: '800', letterSpacing: -0.6 },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700', letterSpacing: -0.4 },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '700', letterSpacing: -0.2 },
  subtitle: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodySmall: { fontSize: 13, lineHeight: 19, fontWeight: '400' },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;

export function createShadows(color: string) {
  const make = (height: number, radius: number, opacity: number, elevation: number): ViewStyle =>
    Platform.select<ViewStyle>({
      web: { boxShadow: `0px ${height}px ${radius * 2}px rgba(27, 33, 64, ${opacity})` },
      default: {
        shadowColor: color,
        shadowOffset: { width: 0, height },
        shadowOpacity: opacity,
        shadowRadius: radius,
        elevation,
      },
    });

  return {
    sm: make(1, 3, 0.06, 1),
    md: make(4, 10, 0.08, 3),
    lg: make(10, 20, 0.12, 6),
  } as const;
}

export const motion = {
  stagger: 70,
  entranceDuration: 420,
  themeFadeIn: 140,
  themeFadeOut: 340,
  pressScale: 0.97,
} as const;
