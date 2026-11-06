import { View } from 'react-native';

import {
  AsyncContent,
  Badge,
  ChipList,
  FadeInView,
  Screen,
  SectionHeader,
  SkeletonList,
  TimelineItem,
} from '@/components';
import { useExperiences, usePullToRefresh } from '@/hooks';
import { formatDuration, formatPeriod, monthsBetween } from '@/utils/date';
import { pluralize } from '@/utils/text';

export default function ExperienceScreen() {
  const experiences = useExperiences();
  const refresh = usePullToRefresh([experiences]);

  return (
    <Screen {...refresh}>
      <AsyncContent resource={experiences} skeleton={<SkeletonList variant="timeline" />}>
        {(items) => {
          const totalMonths = items.reduce(
            (sum, item) => sum + monthsBetween(item.startDate, item.endDate),
            0,
          );

          return (
            <>
              <FadeInView>
                <SectionHeader
                  eyebrow="Trajetória"
                  title="Onde já atuei"
                  subtitle={
                    items.length > 0
                      ? `${pluralize(items.length, 'experiência', 'experiências')} · ${formatDuration(totalMonths)} no total`
                      : 'Nenhuma experiência profissional cadastrada ainda.'
                  }
                />
              </FadeInView>
              <View>
                {items.map((item, index) => {
                  const isCurrent = item.endDate === null;
                  const duration = formatDuration(monthsBetween(item.startDate, item.endDate));
                  return (
                    <TimelineItem
                      key={item.id}
                      index={index + 1}
                      active={isCurrent}
                      isLast={index === items.length - 1}
                      title={item.role}
                      subtitle={item.company}
                      period={`${formatPeriod(item.startDate, item.endDate)} · ${duration}`}
                      badge={isCurrent ? <Badge label="Atual" tone="success" icon="radio-button-on" /> : null}
                      description={item.description}
                      footer={<ChipList items={item.technologies} tone="primary" />}
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
