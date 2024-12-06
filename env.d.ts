/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_APP_URL: string;
  readonly VITE_APP_CLIENT_ID: string;
  // Add more variables as needed...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
