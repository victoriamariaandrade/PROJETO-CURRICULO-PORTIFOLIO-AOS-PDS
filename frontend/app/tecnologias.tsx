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
import { usePullToRefresh, useSkills } from '@/hooks';
import { useTheme } from '@/theme';
import { resolveIcon } from '@/utils/icons';
import { pluralize } from '@/utils/text';

export default function SkillsScreen() {
  const { spacing } = useTheme();
  const skills = useSkills();
  const refresh = usePullToRefresh([skills]);

  return (
    <Screen {...refresh}>
      <AsyncContent resource={skills} skeleton={<SkeletonList count={5} />}>
        {(categories) => {
          const total = categories.reduce((sum, category) => sum + category.skills.length, 0);

          return (
            <>
              <FadeInView>
                <SectionHeader
                  eyebrow="Stack"
                  title="Tecnologias e ferramentas"
                  subtitle={`${pluralize(total, 'tecnologia', 'tecnologias')} em ${pluralize(
                    categories.length,
                    'categoria',
                    'categorias',
                  )}`}
                />
              </FadeInView>
              <View style={{ gap: spacing.lg }}>
                {categories.map((category, index) => (
                  <FadeInView key={category.id} index={index + 1}>
                    <Card style={{ gap: spacing.md }}>
                      <View style={[styles.row, { gap: spacing.md }]}>
                        <IconBadge name={resolveIcon(category.icon, 'pricetag-outline')} tone="accent" />
                        <View style={styles.flex}>
                          <AppText variant="subtitle">{category.name}</AppText>
                          <AppText variant="caption" tone="subtle">
                            {pluralize(category.skills.length, 'item', 'itens')}
                          </AppText>
                        </View>
                      </View>
                      <ChipList items={category.skills.map((skill) => skill.name)} tone="primary" />
                    </Card>
                  </FadeInView>
                ))}
              </View>
            </>
          );
        }}
      </AsyncContent>
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
});
