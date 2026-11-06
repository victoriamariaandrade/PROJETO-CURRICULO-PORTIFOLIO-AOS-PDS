import * as Linking from 'expo-linking';

export async function openExternalLink(url: string): Promise<boolean> {
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}
