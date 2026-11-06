import { View } from 'react-native';

import {
  AsyncContent,
  Badge,
  FadeInView,
  Screen,
  SectionHeader,
  SkeletonList,
  TimelineItem,
} from '@/components';
import { useEducation, usePullToRefresh } from '@/hooks';
import { formatYearRange } from '@/utils/date';
import { pluralize } from '@/utils/text';

export default function EducationScreen() {
  const education = useEducation();
  const refresh = usePullToRefresh([education]);

  return (
    <Screen {...refresh}>
      <AsyncContent resource={education} skeleton={<SkeletonList variant="timeline" />}>
        {(items) => {
          const completed = items.filter((item) => item.status === 'completed').length;

          return (
            <>
              <FadeInView>
                <SectionHeader
                  eyebrow="Formação"
                  title="Base acadêmica"
                  subtitle={`${pluralize(completed, 'curso concluído', 'cursos concluídos')} · ${pluralize(
                    items.length - completed,
                    'em andamento',
                    'em andamento',
                  )}`}
                />
              </FadeInView>
              <View>
                {items.map((item, index) => {
                  const inProgress = item.status === 'in-progress';
                  return (
                    <TimelineItem
                      key={item.id}
                      index={index + 1}
                      active={inProgress}
                      isLast={index === items.length - 1}
                      eyebrow={item.degree}
                      title={item.course}
                      subtitle={item.institution}
                      period={formatYearRange(item.startYear, item.endYear)}
                      badge={
                        inProgress ? (
                          <Badge label="Em andamento" tone="warning" icon="time-outline" />
                        ) : (
                          <Badge label="Concluído" tone="success" icon="checkmark-circle-outline" />
                        )
                      }
                      description={item.description}
                    />
                  );
                })}
              </View>
            </>
          );
        }}
      </AsyncContent>
    </Screen>
  );
}
