import { useCallback, useEffect, useEffectEvent, useState } from 'react';

export interface AsyncResource<T> {
  /** Último dado disponível; durante um `refetch` continua exibindo o anterior. */
  data: T | null;
  loading: boolean;
  error: Error | null;
  /** Descarta o cache e busca novamente. */
  refetch: () => void;
}

interface Settled<T> {
  key: string;
  requestId: string;
  data: T | null;
  error: Error | null;
}

// Cache em memória por chave: ao voltar para uma tela já visitada, os dados aparecem na hora.
const cache = new Map<string, unknown>();

function toError(reason: unknown): Error {
  return reason instanceof Error ? reason : new Error(String(reason));
}

export function useAsyncResource<T>(key: string, fetcher: () => Promise<T>): AsyncResource<T> {
  const [attempt, setAttempt] = useState(0);
  const requestId = `${key}:${attempt}`;
  const [settled, setSettled] = useState<Settled<T> | null>(() =>
    cache.has(key) ? { key, requestId, data: cache.get(key) as T, error: null } : null,
  );

  const runFetcher = useEffectEvent(() => fetcher());

  useEffect(() => {
    if (cache.has(key)) return;

    let active = true;
    runFetcher().then(
      (data) => {
        cache.set(key, data);
        if (active) setSettled({ key, requestId, data, error: null });
      },
      (reason: unknown) => {
        if (active) setSettled({ key, requestId, data: null, error: toError(reason) });
      },
    );

    return () => {
      active = false;
    };
  }, [key, requestId]);

  const refetch = useCallback(() => {
    cache.delete(key);
    setAttempt((value) => value + 1);
  }, [key]);

  const isCached = cache.has(key);
  const current = settled?.requestId === requestId ? settled : null;
  const previous = settled?.key === key ? settled.data : null;

  return {
    data: isCached ? (cache.get(key) as T) : (current?.data ?? previous),
    loading: !isCached && current === null,
    error: isCached ? null : (current?.error ?? null),
    refetch,
  };
}
