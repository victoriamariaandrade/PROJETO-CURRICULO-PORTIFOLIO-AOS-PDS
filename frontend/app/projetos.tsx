import { StyleSheet, View } from 'react-native';

import {
  AppText,
  AsyncContent,
  Card,
  ChipList,
  FadeInView,
  IconBadge,
  Screen,
  SectionHeader,
  SkeletonList,
} from '@/components';
import { usePullToRefresh, useProjects, useResponsive } from '@/hooks';
import { useTheme } from '@/theme';
import type { Project } from '@/types';
import { resolveIcon } from '@/utils/icons';
import { pluralize } from '@/utils/text';

function ProjectCard({ project }: { project: Project }) {
  const { spacing } = useTheme();
  const details = [project.category, project.partner].filter(Boolean).join(' · ');

  return (
    <Card style={[styles.fill, { gap: spacing.md }]}>
      <View style={[styles.row, { gap: spacing.md }]}>
        <IconBadge name={resolveIcon(project.icon, 'folder-open-outline')} size={44} />
        <View style={[styles.flex, { gap: spacing.xxs }]}>
          <AppText variant="heading">{project.name}</AppText>
          {details ? (
            <AppText variant="caption" tone="subtle">
              {details}
            </AppText>
          ) : null}
        </View>
      </View>
      <AppText variant="bodySmall" tone="muted">
        {project.description}
      </AppText>
      <ChipList items={project.technologies} />
    </Card>
  );
}

export default function ProjectsScreen() {
  const { spacing } = useTheme();
  const { isWide } = useResponsive();
  const projects = useProjects();
  const refresh = usePullToRefresh([projects]);

  return (
    <Screen {...refresh}>
      <AsyncContent resource={projects} skeleton={<SkeletonList count={4} />}>
        {(items) => (
          <>
            <FadeInView>
              <SectionHeader
                eyebrow="Portfólio"
                title="Projetos em destaque"
                subtitle={pluralize(items.length, 'projeto desenvolvido', 'projetos desenvolvidos')}
              />
            </FadeInView>
            <View style={[styles.wrap, { marginHorizontal: -spacing.sm, rowGap: spacing.lg }]}>
              {items.map((project, index) => (
                <FadeInView
                  key={project.id}
                  index={index + 1}
                  style={{ width: isWide ? '50%' : '100%', paddingHorizontal: spacing.sm }}
                >
                  <ProjectCard project={project} />
                </FadeInView>
              ))}
            </View>
          </>
        )}
      </AsyncContent>
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
});
