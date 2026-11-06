import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet } from 'react-native';

import { useTheme } from '@/theme';
import type { ContactLink, ContactType } from '@/types';
import type { IconName } from '@/utils/icons';
import { openExternalLink } from '@/utils/links';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

const CONTACT_META: Record<ContactType, { icon: IconName; title: string }> = {
  email: { icon: 'mail-outline', title: 'E-mail' },
  github: { icon: 'logo-github', title: 'GitHub' },
  linkedin: { icon: 'logo-linkedin', title: 'LinkedIn' },
  website: { icon: 'globe-outline', title: 'Site' },
};

/** Botão translúcido de contato, usado sobre o gradiente do cartão principal. */
export function ContactButton({ contact }: { contact: ContactLink }) {
  const { radii, spacing } = useTheme();
  const meta = CONTACT_META[contact.type];

  return (
    <PressableScale
      onPress={() => void openExternalLink(contact.url)}
      accessibilityRole="link"
      accessibilityLabel={`${meta.title}: ${contact.label}`}
      style={[
        styles.button,
        {
          borderRadius: radii.pill,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          gap: spacing.xs + 2,
        },
      ]}
    >
      <Ionicons name={meta.icon} size={16} color="#FFFFFF" />
      <AppText variant="label" style={styles.label}>
        {meta.title}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  label: {
    color: '#FFFFFF',
  },
});
