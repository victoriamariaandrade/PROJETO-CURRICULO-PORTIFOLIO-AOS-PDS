import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = '@portfolio/theme-mode';
const VALID_MODES: readonly ThemeMode[] = ['system', 'light', 'dark'];

function isThemeMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && (VALID_MODES as readonly string[]).includes(value);
}

/** Lê a preferência salva. Retorna `null` quando não há escolha registrada ou o storage falha. */
export async function loadThemeMode(): Promise<ThemeMode | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return isThemeMode(stored) ? stored : null;
  } catch {
    return null;
  }
}

export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // A preferência só deixa de persistir; o app continua funcionando normalmente.
  }
}
