import { ApiResumeService } from './ApiResumeService';
import type { ResumeService } from './ResumeService';
import { StaticResumeService } from './StaticResumeService';

export const DATA_SOURCES = ['api', 'static'] as const;
export type DataSource = (typeof DATA_SOURCES)[number];

export const DEFAULT_DATA_SOURCE: DataSource = 'api';

/** Pessoa exibida quando `EXPO_PUBLIC_PERSON` não está definida. */
export const DEFAULT_PERSON = 'victoria-andrade';

/**
 * Registro das implementações disponíveis:
 * - `api`: API REST do diretório `backend/` (Express + PostgreSQL/NeonDB);
 * - `static`: dados locais de `src/data`, úteis para desenvolver sem rede.
 */
const factories: Record<DataSource, () => ResumeService> = {
  api: () =>
    new ApiResumeService({
      baseUrl: process.env.EXPO_PUBLIC_API_URL,
      person: process.env.EXPO_PUBLIC_PERSON?.trim() || DEFAULT_PERSON,
    }),
  static: () => new StaticResumeService(),
};

export function parseDataSource(value: string | undefined): DataSource {
  const normalized = value?.trim().toLowerCase();
  return DATA_SOURCES.find((source) => source === normalized) ?? DEFAULT_DATA_SOURCE;
}

export function createResumeService(source: DataSource): ResumeService {
  return factories[source]();
}
