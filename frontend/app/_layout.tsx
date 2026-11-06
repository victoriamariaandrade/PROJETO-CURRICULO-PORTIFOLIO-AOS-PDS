import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider, type Theme as NavigationTheme } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppDrawerContent, ThemeToggleButton } from '@/components';
import { appRoutes } from '@/navigation/routes';
import { ThemeProvider, useTheme } from '@/theme';

function RootNavigator() {
  const theme = useTheme();
  const { colors, typography } = theme;
  const { width } = useWindowDimensions();

  const navigationTheme = useMemo<NavigationTheme>(() => {
    const base = theme.scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.background,
        text: colors.text,
        border: colors.border,
      },
    };
  }, [theme.scheme, colors]);

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <Drawer
        drawerContent={(props) => <AppDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerTintColor: colors.text,
          headerTitleStyle: { ...typography.subtitle, color: colors.text },
          headerRight: () => <ThemeToggleButton />,
          drawerType: 'front',
          drawerStyle: { backgroundColor: colors.surface, width: Math.min(320, width * 0.84) },
          overlayColor: colors.overlay,
          sceneStyle: { backgroundColor: colors.background },
          swipeEdgeWidth: 48,
        }}
      >
        {appRoutes.map((route) => (
          <Drawer.Screen
            key={route.name}
            name={route.name}
            options={{ title: route.title, drawerLabel: route.label }}
          />
        ))}
        <Drawer.Screen name="+not-found" options={{ title: 'Página não encontrada' }} />
      </Drawer>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
