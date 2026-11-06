import { resumeService } from '@/services';

import { useAsyncResource } from './useAsyncResource';

export const useProfile = () => useAsyncResource('profile', () => resumeService.getProfile());

export const useEducation = () => useAsyncResource('education', () => resumeService.getEducation());

export const useExperiences = () =>
  useAsyncResource('experiences', () => resumeService.getExperiences());

export const useProjects = () => useAsyncResource('projects', () => resumeService.getProjects());

export const useSkills = () => useAsyncResource('skills', () => resumeService.getSkills());
