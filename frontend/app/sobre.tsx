import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  Badge,
  Card,
  Chip,
  FadeInView,
  IconBadge,
  Screen,
  SectionHeader,
  ThemeModeSelector,
} from '@/components';
import type { FeatureHighlight } from '@/data/appInfo';
import { useAppInfo } from '@/hooks';
import { useTheme } from '@/theme';
import { resolveIcon } from '@/utils/icons';

function BulletList({ items }: { items: string[] }) {
  const { colors, spacing } = useTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      {items.map((item) => (
        <View key={item} style={[styles.bullet, { gap: spacing.sm }]}>
          <Ionicons name="checkmark-circle" size={16} color={colors.accent} style={styles.bulletIcon} />
          <AppText variant="bodySmall" tone="muted" style={styles.flex}>
            {item}
          </AppText>
        </View>
      ))}
    </View>
  );
}

function FeatureCard({ feature, children }: { feature: FeatureHighlight; children?: ReactNode }) {
  const { spacing } = useTheme();
  return (
    <Card style={{ gap: spacing.md }}>
      <View style={[styles.row, { gap: spacing.md }]}>
        <IconBadge name={resolveIcon(feature.icon, 'star-outline')} />
        <AppText variant="heading" style={styles.flex}>
          {feature.title}
        </AppText>
      </View>
      <AppText variant="body" tone="muted">
        {feature.summary}
      </AppText>
      {children}
      <BulletList items={feature.details} />
    </Card>
  );
}

export default function AboutScreen() {
  const { colors, spacing } = useTheme();
  const { appName, version, dataSource, stack, themeFeature, architectureNotes } = useAppInfo();
  const totalItems = stack.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <Screen>
      <FadeInView>
        <SectionHeader
          eyebrow={`${appName} · v${version}`}
          title="Como este app foi feito"
          subtitle={`Aplicativo de currículo construído com React Native e Expo. Abaixo, as ${totalItems} tecnologias e bibliotecas usadas e o papel de cada uma.`}
        />
      </FadeInView>

      <FadeInView index={1}>
        <View style={{ gap: spacing.sm }}>
          <Badge label="Funcionalidade extra" tone="primary" icon="sparkles" />
          <FeatureCard feature={themeFeature}>
            <View style={{ gap: spacing.sm }}>
              <AppText variant="caption" tone="subtle">
                Experimente agora:
              </AppText>
              <ThemeModeSelector />
            </View>
          </FeatureCard>
        </View>
      </FadeInView>

      <FadeInView index={2}>
        <FeatureCard feature={architectureNotes}>
          <View style={[styles.row, { gap: spacing.sm }]}>
            <AppText variant="caption" tone="subtle">
              Fonte de dados ativa:
            </AppText>
            <Chip label={dataSource} tone="primary" />
          </View>
        </FeatureCard>
      </FadeInView>

      <FadeInView index={3}>
        <SectionHeader eyebrow="Stack" title="Tecnologias do app" />
      </FadeInView>

      {stack.map((group, groupIndex) => (
        <FadeInView key={group.id} index={groupIndex + 4}>
          <Card style={{ gap: spacing.md }}>
            <View style={[styles.row, { gap: spacing.md }]}>
              <IconBadge name={resolveIcon(group.icon, 'cube-outline')} tone="accent" size={36} />
              <AppText variant="subtitle">{group.title}</AppText>
            </View>
            {group.items.map((item, itemIndex) => (
              <View
                key={item.name}
                style={[
                  { gap: spacing.xxs, paddingTop: spacing.md },
                  itemIndex > 0 && {
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: colors.border,
                  },
                ]}
              >
                <View style={[styles.row, styles.spaceBetween, { gap: spacing.sm }]}>
                  <AppText variant="label" style={styles.flex}>
                    {item.name}
                  </AppText>
                  {item.version ? (
                    <AppText variant="caption" tone="subtle">
                      v{item.version}
                    </AppText>
                  ) : null}
                </View>
                <AppText variant="bodySmall" tone="muted">
                  {item.role}
                </AppText>
              </View>
            ))}
          </Card>
        </FadeInView>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  bullet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletIcon: {
    marginTop: 2,
  },
});
