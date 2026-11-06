import type {
  ContactLink,
  Education,
  Experience,
  Profile,
  Project,
  SkillCategory,
} from '@/types';

import type { ResumeService } from './ResumeService';

interface ApiResumeServiceOptions {
  /** URL base da API, sem barra final (ex.: `https://minha-api.vercel.app`). */
  baseUrl: string | undefined;
  /** ID numérico ou slug da pessoa cujo currículo será exibido. */
  person: string;
  timeoutMs?: number;
}

// Formato devolvido pela API: IDs numéricos e `null` nos campos opcionais.
type ApiEntity<T> = Omit<T, 'id'> & { id: number };
type Nullable<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: T[P] | null };

type ApiContact = ApiEntity<ContactLink>;
type ApiProfile = Nullable<Omit<Profile, 'contacts'>, 'headline' | 'location' | 'avatarUrl'> & {
  interests: string[];
  contacts: ApiContact[];
};
type ApiEducation = Nullable<ApiEntity<Education>, 'description'>;
type ApiExperience = ApiEntity<Experience>;
type ApiProject = Nullable<ApiEntity<Project>, 'category' | 'partner' | 'icon' | 'repositoryUrl'>;
type ApiSkillCategory = Nullable<Omit<ApiEntity<SkillCategory>, 'skills'>, 'icon'> & {
  skills: { id: number; name: string }[];
};

interface ApiErrorBody {
  error?: { message?: string };
}

const optional = <T>(value: T | null): T | undefined => value ?? undefined;

/** Consome a API REST (Express + PostgreSQL/NeonDB) do diretório `backend/`. */
export class ApiResumeService implements ResumeService {
  private readonly baseUrl: string;
  private readonly person: string;
  private readonly timeoutMs: number;

  constructor({ baseUrl, person, timeoutMs = 15_000 }: ApiResumeServiceOptions) {
    this.baseUrl = (baseUrl ?? '').trim().replace(/\/+$/, '');
    this.person = person;
    this.timeoutMs = timeoutMs;
  }

  async getProfile(): Promise<Profile> {
    const profile = await this.get<ApiProfile>('');
    return {
      name: profile.name,
      role: profile.role,
      // Sem headline cadastrado, a linha abaixo do cargo mostra as áreas de interesse.
      headline: profile.headline ?? profile.interests.join(' · '),
      summary: profile.summary,
      location: optional(profile.location),
      avatarUrl: optional(profile.avatarUrl),
      contacts: profile.contacts.map(({ id, type, label, url }) => ({ id: String(id), type, label, url })),
    };
  }

  async getEducation(): Promise<Education[]> {
    const items = await this.get<ApiEducation[]>('/education');
    return items.map((item) => ({
      id: String(item.id),
      degree: item.degree,
      course: item.course,
      institution: item.institution,
      startYear: item.startYear,
      endYear: item.endYear,
      status: item.status,
      description: optional(item.description),
    }));
  }

  async getExperiences(): Promise<Experience[]> {
    const items = await this.get<ApiExperience[]>('/experiences');
    return items.map((item) => ({
      id: String(item.id),
      role: item.role,
      company: item.company,
      startDate: item.startDate,
      endDate: item.endDate,
      description: item.description,
      technologies: item.technologies,
    }));
  }

  async getProjects(): Promise<Project[]> {
    const items = await this.get<ApiProject[]>('/projects');
    return items.map((item) => ({
      id: String(item.id),
      name: item.name,
      description: item.description,
      category: optional(item.category),
      partner: optional(item.partner),
      icon: optional(item.icon),
      technologies: item.technologies,
      repositoryUrl: optional(item.repositoryUrl),
    }));
  }

  async getSkills(): Promise<SkillCategory[]> {
    const items = await this.get<ApiSkillCategory[]>('/skill-categories');
    return items.map((item) => ({
      id: String(item.id),
      name: item.name,
      icon: optional(item.icon),
      skills: item.skills.map((skill) => ({ id: String(skill.id), name: skill.name })),
    }));
  }

  /** GET em `/api/people/:person{path}`, devolvendo o campo `data` da resposta. */
  private async get<T>(path: string): Promise<T> {
    if (!this.baseUrl) {
      throw new Error('Defina EXPO_PUBLIC_API_URL com o endereço da API e reinicie o bundler.');
    }

    const url = `${this.baseUrl}/api/people/${encodeURIComponent(this.person)}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      response = await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal });
    } catch {
      throw new Error(
        controller.signal.aborted
          ? 'A API demorou demais para responder. Tente novamente.'
          : 'Não foi possível conectar à API. Verifique sua conexão e tente novamente.',
      );
    } finally {
      clearTimeout(timer);
    }

    const body = (await response.json().catch(() => null)) as ({ data: T } & ApiErrorBody) | null;
    if (!response.ok || !body || !('data' in body)) {
      throw new Error(body?.error?.message ?? `A API respondeu com erro ${response.status}.`);
    }
    return body.data;
  }
}
