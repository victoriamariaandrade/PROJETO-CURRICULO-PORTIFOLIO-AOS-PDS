import type { ISODate } from '@/types';

const MONTHS_SHORT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const AVERAGE_DAYS_PER_MONTH = 30.44;

function parseISODate(value: ISODate): Date {
  const [year = 1970, month = 1, day = 1] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** `2024-05-02` → `mai 2024` */
export function formatMonthYear(value: ISODate): string {
  const date = parseISODate(value);
  return `${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

/** Diferença arredondada em meses; sem data final, conta até hoje. */
export function monthsBetween(start: ISODate, end: ISODate | null, now: Date = new Date()): number {
  const from = parseISODate(start);
  const to = end ? parseISODate(end) : now;
  const months =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth()) +
    (to.getDate() - from.getDate()) / AVERAGE_DAYS_PER_MONTH;
  return Math.max(1, Math.round(months));
}

/** `6` → `6 meses`, `14` → `1 ano e 2 meses` */
export function formatDuration(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const yearsLabel = years === 1 ? '1 ano' : `${years} anos`;
  const monthsLabel = months === 1 ? '1 mês' : `${months} meses`;

  if (years === 0) return monthsLabel;
  if (months === 0) return yearsLabel;
  return `${yearsLabel} e ${monthsLabel}`;
}

export function formatPeriod(start: ISODate, end: ISODate | null): string {
  return `${formatMonthYear(start)} — ${end ? formatMonthYear(end) : 'atual'}`;
}

/** `2020, 2024` → `2020 — 2024`; sem ano de início, mostra só a conclusão ou "Cursando". */
export function formatYearRange(startYear: number | null, endYear: number | null): string {
  if (startYear === null) return endYear ? `Concluído em ${endYear}` : 'Cursando';
  return `${startYear} — ${endYear ?? 'atual'}`;
}
