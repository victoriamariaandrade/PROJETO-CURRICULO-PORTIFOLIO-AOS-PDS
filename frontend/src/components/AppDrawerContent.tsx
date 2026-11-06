import Ionicons from '@expo/vector-icons/Ionicons';
import type { DrawerContentComponentProps } from 'expo-router/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppInfo, useProfile } from '@/hooks';
import { appRoutes, type AppRoute } from '@/navigation/routes';
import { useTheme } from '@/theme';
import { selectionFeedback } from '@/utils/haptics';

import { AppText } from './AppText';
import { Avatar } from './Avatar';
import { PressableScale } from './PressableScale';
import { Skeleton } from './Skeleton';
import { ThemeModeSelector } from './ThemeModeSelector';

function DrawerHeader() {
  const { colors, spacing, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const { data: profile } = useProfile();

  return (
    <LinearGradient
      colors={colors.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        paddingTop: insets.top + spacing.xl,
        paddingBottom: spacing.xl,
        paddingHorizontal: spacing.xl,
        borderBottomRightRadius: radii.xl,
        gap: spacing.md,
      }}
    >
      {profile ? (
        <>
          <Avatar name={profile.name} imageUrl={profile.avatarUrl} size={56} onGradient />
          <View style={{ gap: spacing.xxs }}>
            <AppText variant="heading" style={styles.onGradient}>
              {profile.name}
            </AppText>
            <AppText variant="bodySmall" style={styles.onGradientMuted}>
              {profile.role}
            </AppText>
          </View>
        </>
      ) : (
        <>
          <Skeleton width={56} height={56} radius={28} style={styles.translucent} />
          <Skeleton width="60%" height={16} style={styles.translucent} />
        </>
      )}
    </LinearGradient>
  );
}

interface DrawerLinkProps {
  route: AppRoute;
  focused: boolean;
  onPress: () => void;
}

function DrawerLink({ route, focused, onPress }: DrawerLinkProps) {
  const { colors, spacing, radii } = useTheme();
  const tint = focused ? colors.primary : colors.textMuted;

  return (
    <PressableScale
      haptic={false}
      onPress={onPress}
      accessibilityRole="link"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={route.label}
      style={[
        styles.link,
        {
          gap: spacing.md,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          borderRadius: radii.md,
          backgroundColor: focused ? colors.primarySoft : 'transparent',
        },
      ]}
    >
      <Ionicons name={focused ? route.activeIcon : route.icon} size={20} color={tint} />
      <AppText variant="label" style={[styles.flex, { color: focused ? colors.primary : colors.text }]}>
        {route.label}
      </AppText>
      {focused ? <View style={[styles.activeDot, { backgroundColor: colors.primary }]} /> : null}
    </PressableScale>
  );
}

export function AppDrawerContent({ state, navigation }: DrawerContentComponentProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { version } = useAppInfo();
  const activeRouteName = state.routes[state.index]?.name;

  return (
    <View style={[styles.flex, { backgroundColor: colors.surface }]}>
      <DrawerHeader />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.xxs }}
        showsVerticalScrollIndicator={false}
      >
        <AppText
          variant="overline"
          tone="subtle"
          style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }}
        >
          Navegação
        </AppText>
        {appRoutes.map((route) => (
          <DrawerLink
            key={route.name}
            route={route}
            focused={route.name === activeRouteName}
            onPress={() => {
              if (route.name !== activeRouteName) selectionFeedback();
              navigation.navigate(route.name);
              navigation.closeDrawer();
            }}
          />
        ))}
      </ScrollView>

      <View
        style={{
          paddingHorizontal: spacing.xl,
          paddingTop: spacing.lg,
          paddingBottom: insets.bottom + spacing.lg,
          gap: spacing.md,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
        }}
      >
        <AppText variant="overline" tone="subtle">
          Aparência
        </AppText>
        <ThemeModeSelector />
        <AppText variant="caption" tone="subtle">
          Versão {version}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  onGradient: {
    color: '#FFFFFF',
  },
  onGradientMuted: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  translucent: {
    opacity: 0.35,
  },
});
