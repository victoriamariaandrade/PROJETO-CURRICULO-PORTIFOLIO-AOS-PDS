import Constants from 'expo-constants';
import { useMemo } from 'react';

import { appStack, architectureNotes, themeFeature } from '@/data/appInfo';
import { dataSource } from '@/services';

import packageJson from '../../package.json';

const installed: Record<string, string | undefined> = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

const cleanVersion = (range: string | undefined) => range?.replace(/^[\^~>=<\s]+/, '');

/** Metadados do próprio app: stack usada (com versões instaladas) e funcionalidades. */
export function useAppInfo() {
  return useMemo(
    () => ({
      appName: Constants.expoConfig?.name ?? 'Portfólio',
      version: Constants.expoConfig?.version ?? packageJson.version,
      dataSource,
      stack: appStack.map((group) => ({
        ...group,
        items: group.items.map((item) => ({
          ...item,
          version: item.packageName ? cleanVersion(installed[item.packageName]) : undefined,
        })),
      })),
      themeFeature,
      architectureNotes,
    }),
    [],
  );
}
