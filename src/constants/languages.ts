export const LANGUAGES = {
  EN: 'en',
  KO: 'ko',
  JP: 'jp',
} as const;

export const DEFAULT_FALLBACK_LANGUAGE = {
  id: 1,
  code: 'en',
  name: 'English',
  is_default: true,
};