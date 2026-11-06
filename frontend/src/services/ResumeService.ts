import type { Education, Experience, Profile, Project, SkillCategory } from '@/types';

/**
 * Contrato da fonte de dados do currículo.
 *
 * As telas dependem apenas desta interface (via hooks), então trocar dados estáticos
 * por uma API é questão de criar outra implementação e registrá-la na factory.
 */
export interface ResumeService {
  getProfile(): Promise<Profile>;
  getEducation(): Promise<Education[]>;
  getExperiences(): Promise<Experience[]>;
  getProjects(): Promise<Project[]>;
  getSkills(): Promise<SkillCategory[]>;
}
