import * as data from '@/data';

import type { ResumeService } from './ResumeService';

interface StaticResumeServiceOptions {
  /** Latência simulada, em milissegundos, para exercitar os estados de carregamento. */
  latencyMs?: number;
}

export class StaticResumeService implements ResumeService {
  private readonly latencyMs: number;

  constructor({ latencyMs = 450 }: StaticResumeServiceOptions = {}) {
    this.latencyMs = latencyMs;
  }

  getProfile() {
    return this.resolve(data.profile);
  }

  getEducation() {
    return this.resolve(data.education);
  }

  getExperiences() {
    return this.resolve(data.experiences);
  }

  getProjects() {
    return this.resolve(data.projects);
  }

  getSkills() {
    return this.resolve(data.skills);
  }

  private resolve<T>(value: T): Promise<T> {
    // Devolve uma cópia para que nenhum consumidor altere os dados de origem.
    const copy = JSON.parse(JSON.stringify(value)) as T;
    if (this.latencyMs <= 0) return Promise.resolve(copy);
    return new Promise((resolve) => setTimeout(() => resolve(copy), this.latencyMs));
  }
}
