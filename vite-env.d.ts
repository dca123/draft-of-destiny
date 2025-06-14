/// <reference types="vite/client" />

interface ViteTypeOptions {}

interface ImportMetaEnv {
  readonly VITE_PARTYKIT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
