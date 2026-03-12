/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly PUBLIC_FORMSPREE_ENDPOINT: string;
  readonly PUBLIC_ADMIN_EMAIL: string;
  // Legacy VITE_ prefixed vars (used by validateEnv.ts / environment.ts)
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_FORMSPREE_ENDPOINT: string;
  readonly VITE_GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface PyodideInterface {
  runPythonAsync(code: string): Promise<unknown>;
  loadPackagesFromImports(code: string): Promise<void>;
}

interface Window {
  loadPyodide(options: { indexURL: string }): Promise<PyodideInterface>;
}
