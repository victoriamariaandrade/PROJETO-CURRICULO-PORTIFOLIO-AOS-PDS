/// <reference types="expo/types" />

declare namespace NodeJS {
  interface ProcessEnv {
    /** Fonte de dados do currículo: `api` (padrão) ou `static`. */
    EXPO_PUBLIC_DATA_SOURCE?: string;
    /** URL base da API REST, sem barra final (ex.: `https://minha-api.vercel.app`). */
    EXPO_PUBLIC_API_URL?: string;
    /** ID ou slug da pessoa exibida (padrão: `victoria-andrade`). */
    EXPO_PUBLIC_PERSON?: string;
  }
}
