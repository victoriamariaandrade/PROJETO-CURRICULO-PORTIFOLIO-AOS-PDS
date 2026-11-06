import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  AsyncContent,
  Avatar,
  Badge,
  Card,
  ContactButton,
  FadeInView,
  IconBadge,
  Screen,
  SectionHeader,
  ShortcutCard,
  Skeleton,
  StatTile,
} from '@/components';
import {
  useExperiences,
  useProfile,
  useProjects,
  usePullToRefresh,
  useResponsive,
  useSkills,
} from '@/hooks';
import { sectionRoutes } from '@/navigation/routes';
import { useTheme } from '@/theme';
import type { Experience, Profile } from '@/types';
import { formatDuration, monthsBetween } from '@/utils/date';

function HeroSkeleton() {
  const { colors, radii, spacing } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radii.xl,
        padding: spacing.xxl,
        gap: spacing.md,
      }}
    >
      <Skeleton width={84} height={84} radius={42} />
      <Skeleton width="70%" height={26} />
      <Skeleton width="50%" height={16} />
      <Skeleton height={14} />
      <Skeleton width="85%" height={14} />
    </View>
  );
}

function Hero({ profile, stats }: { profile: Profile; stats: { value: string; label: string }[] }) {
  const { colors, radii, spacing, shadows } = useTheme();
  const { isCompact } = useResponsive();
  // Nomes longos usam um tamanho menor para não ocuparem várias linhas ao lado do avatar.
  const nameVariant = isCompact || profile.name.length > 20 ? 'title' : 'display';

  return (
    <LinearGradient
      colors={colors.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ borderRadius: radii.xl, padding: isCompact ? spacing.lg : spacing.xxl, gap: spacing.lg }, shadows.lg]}
    >
      <View style={[styles.heroTop, { gap: spacing.lg }]}>
        <Avatar name={profile.name} imageUrl={profile.avatarUrl} size={isCompact ? 68 : 84} onGradient />
        <View style={[styles.flex, { gap: spacing.xxs }]}>
          <AppText variant="overline" style={styles.onGradientMuted}>
            Olá, eu sou
          </AppText>
          <AppText variant={nameVariant} style={styles.onGradient}>
            {profile.name}
          </AppText>
        </View>
      </View>

      <View style={{ gap: spacing.xs }}>
        <AppText variant="subtitle" style={styles.onGradient}>
          {profile.role}
        </AppText>
        <AppText variant="bodySmall" style={styles.onGradientMuted}>
          {profile.headline}
        </AppText>
      </View>

      <AppText variant="body" style={styles.onGradientMuted}>
        {profile.summary}
      </AppText>

      {stats.length > 0 ? (
        <View style={[styles.stats, { gap: spacing.sm }]}>
          {stats.map((stat) => (
            <StatTile key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </View>
      ) : null}

      <View style={[styles.wrap, { gap: spacing.sm }]}>
        {profile.contacts.map((contact) => (
          <ContactButton key={contact.id} contact={contact} />
        ))}
      </View>
    </LinearGradient>
  );
}

function CurrentRole({ experience }: { experience: Experience }) {
  const { spacing } = useTheme();
  const duration = formatDuration(monthsBetween(experience.startDate, experience.endDate));

  return (
    <Card onPress={() => router.navigate('/experiencia')} accessibilityLabel="Ver experiência atual">
      <View style={[styles.row, { gap: spacing.md }]}>
        <IconBadge name="briefcase-outline" tone="accent" size={44} />
        <View style={[styles.flex, { gap: spacing.xxs }]}>
          <Badge label="Atualmente" tone="success" icon="radio-button-on" />
          <AppText variant="subtitle">{experience.role}</AppText>
          <AppText variant="bodySmall" tone="muted">
            {experience.company} · {duration}
          </AppText>
        </View>
      </View>
    </Card>
  );
}

export default function HomeScreen() {
  const { spacing } = useTheme();
  const { columns } = useResponsive();
  const profile = useProfile();
  const experiences = useExperiences();
  const projects = useProjects();
  const skills = useSkills();

  const totalMonths = (experiences.data ?? []).reduce(
    (sum, item) => sum + monthsBetween(item.startDate, item.endDate),
    0,
  );
  const techCount = (skills.data ?? []).reduce((sum, category) => sum + category.skills.length, 0);

  const stats = [
    // Sem experiências cadastradas, o indicador de anos de experiência não aparece.
    experiences.data?.length && { value: `${Math.floor(totalMonths / 12)}+`, label: 'anos de experiência' },
    projects.data && { value: String(projects.data.length), label: 'projetos' },
    skills.data && { value: String(techCount), label: 'tecnologias' },
  ].filter((stat): stat is { value: string; label: string } => Boolean(stat));

  const currentRole = experiences.data?.find((item) => item.endDate === null);
  const cardWidth = `${100 / columns}%` as const;
  // Último card sozinho na linha ocupa a largura toda, evitando um "buraco" na grade.
  const isOrphan = (index: number) =>
    index === sectionRoutes.length - 1 && sectionRoutes.length % columns === 1;

  const refresh = usePullToRefresh([profile, experiences, projects, skills]);

  return (
    <Screen {...refresh}>
      <FadeInView>
        <AsyncContent resource={profile} skeleton={<HeroSkeleton />}>
          {(data) => <Hero profile={data} stats={stats} />}
        </AsyncContent>
      </FadeInView>

      {currentRole ? (
        <FadeInView index={1}>
          <CurrentRole experience={currentRole} />
        </FadeInView>
      ) : null}

      <View style={{ gap: spacing.lg }}>
        <FadeInView index={2}>
          <SectionHeader eyebrow="Explore" title="Seções do portfólio" />
        </FadeInView>
        <View style={[styles.wrap, { marginHorizontal: -spacing.sm / 2, rowGap: spacing.sm }]}>
          {sectionRoutes.map((route, index) => (
            <FadeInView
              key={route.name}
              index={index + 3}
              style={{
                width: isOrphan(index) ? '100%' : cardWidth,
                paddingHorizontal: spacing.sm / 2,
              }}
            >
              <ShortcutCard
                label={route.label}
                description={route.description}
                icon={route.icon}
                onPress={() => router.navigate(route.href)}
                style={styles.fill}
              />
            </FadeInView>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  fill: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onGradient: {
    color: '#FFFFFF',
  },
  onGradientMuted: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
});
