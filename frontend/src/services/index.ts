import { createResumeService, parseDataSource } from './createResumeService';

/** Fonte de dados configurada via `EXPO_PUBLIC_DATA_SOURCE` (padrão: `api`). */
export const dataSource = parseDataSource(process.env.EXPO_PUBLIC_DATA_SOURCE);

export const resumeService = createResumeService(dataSource);

export { ApiResumeService } from './ApiResumeService';
export { createResumeService, DATA_SOURCES, parseDataSource } from './createResumeService';
export type { DataSource } from './createResumeService';
export type { ResumeService } from './ResumeService';
export { StaticResumeService } from './StaticResumeService';
