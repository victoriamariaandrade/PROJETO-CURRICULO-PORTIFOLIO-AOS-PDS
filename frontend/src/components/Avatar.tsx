import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet } from 'react-native';

import { useTheme } from '@/theme';
import { getInitials } from '@/utils/text';

import { AppText } from './AppText';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: number;
  /** Em fundos com gradiente, o avatar ganha um anel claro para destacar. */
  onGradient?: boolean;
}

export function Avatar({ name, imageUrl, size = 72, onGradient = false }: AvatarProps) {
  const { colors } = useTheme();
  const ring = onGradient ? 'rgba(255, 255, 255, 0.55)' : colors.border;

  return (
    <LinearGradient
      colors={onGradient ? ['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.08)'] : colors.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, borderColor: ring },
      ]}
      accessibilityRole="image"
      accessibilityLabel={`Avatar de ${name}`}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={{ width: size, height: size }} resizeMode="cover" />
      ) : (
        <AppText
          style={{ color: '#FFFFFF', fontSize: size * 0.36, lineHeight: size * 0.44, fontWeight: '800' }}
        >
          {getInitials(name)}
        </AppText>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
  },
});
