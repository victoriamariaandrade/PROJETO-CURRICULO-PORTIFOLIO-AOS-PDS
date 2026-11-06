/** Datas no formato ISO `YYYY-MM-DD`. */
export type ISODate = string;

export type ContactType = 'email' | 'github' | 'linkedin' | 'website';

export interface ContactLink {
  id: string;
  type: ContactType;
  label: string;
  /** URL completa, incluindo esquema (`https://`, `mailto:`). */
  url: string;
}

export interface Profile {
  name: string;
  role: string;
  headline: string;
  summary: string;
  location?: string;
  avatarUrl?: string;
  contacts: ContactLink[];
}

export type EducationStatus = 'completed' | 'in-progress';

export interface Education {
  id: string;
  /** Tipo de formação: Bacharelado, MBA, Especialização... */
  degree: string;
  course: string;
  institution: string;
  /** `null` quando o ano de início não foi informado. */
  startYear: number | null;
  /** `null` enquanto a formação estiver em andamento. */
  endYear: number | null;
  status: EducationStatus;
  description?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  startDate: ISODate;
  /** `null` indica o emprego atual. */
  endDate: ISODate | null;
  description: string;
  technologies: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  /** Tipo do projeto: Web, Mobile, Full Stack... */
  category?: string;
  /** Empresa, instituição ou contexto em que o projeto foi feito. */
  partner?: string;
  /** Nome de um ícone do conjunto Ionicons; a UI usa um ícone padrão se não reconhecer. */
  icon?: string;
  technologies: string[];
  repositoryUrl?: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon?: string;
  skills: Skill[];
}
