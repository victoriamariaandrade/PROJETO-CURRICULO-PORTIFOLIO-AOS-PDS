import type { ReactNode } from 'react';

import type { AsyncResource } from '@/hooks';

import { ErrorState } from './ErrorState';

interface AsyncContentProps<T> {
  resource: AsyncResource<T>;
  /** Placeholder exibido enquanto ainda não há nenhum dado. */
  skeleton: ReactNode;
  children: (data: T) => ReactNode;
}

/** Resolve os três estados de um recurso assíncrono: carregando, erro e sucesso. */
export function AsyncContent<T>({ resource, skeleton, children }: AsyncContentProps<T>) {
  const { data, error, refetch } = resource;

  if (data !== null) return <>{children(data)}</>;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  return <>{skeleton}</>;
}
