import { useState } from 'react';

import type { AsyncResource } from './useAsyncResource';

/** Liga o "puxar para atualizar" a um ou mais recursos assíncronos. */
export function usePullToRefresh(resources: AsyncResource<unknown>[]) {
  const [pulled, setPulled] = useState(false);
  const loading = resources.some((resource) => resource.loading);

  if (pulled && !loading) {
    setPulled(false);
  }

  const onRefresh = () => {
    setPulled(true);
    resources.forEach((resource) => resource.refetch());
  };

  return { refreshing: pulled && loading, onRefresh };
}
