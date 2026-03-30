import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Lee env en runtime. Usa `process.env["NOMBRE"]` para que Next no sustituya
 * valores en el bundle durante `next build` (si quedan vacíos en build, antes
 * podían incrustarse y ignorar las variables del contenedor en Easypanel).
 */
function runtimeEnv(name: string): string {
  const raw = process.env[name];
  if (raw === undefined || raw === null) return "";
  let s = String(raw).trim();
  s = s.replace(/\r/g, "").replace(/^\uFEFF/, "");
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

function looksLikeJwt(value: string): boolean {
  const parts = value.split(".");
  return parts.length >= 3 && parts.every((p) => p.length > 0);
}

/**
 * Cliente Supabase solo para Route Handlers / servidor.
 *
 * En Easypanel define en variables de entorno del **contenedor en ejecución**:
 * - SUPABASE_URL (obligatorio en servidor; misma URL que el proyecto)
 * - SUPABASE_SERVICE_ROLE_KEY (recomendado para /api/test/submit)
 *   o SUPABASE_ANON_KEY
 *
 * Opcional: también se intentan NEXT_PUBLIC_* vía runtimeEnv (por si el runtime
 * las inyecta sin pasar por el bundle).
 */
export function getSupabaseServer(): SupabaseClient {
  const url =
    runtimeEnv("SUPABASE_URL") ||
    runtimeEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key =
    runtimeEnv("SUPABASE_SERVICE_ROLE_KEY") ||
    runtimeEnv("SUPABASE_ANON_KEY") ||
    runtimeEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !key) {
    throw new Error(
      "Supabase no configurado en el servidor: definen SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (o clave anon) en el panel, sin comillas extra."
    );
  }

  if (!looksLikeJwt(key)) {
    throw new Error(
      "La clave de Supabase no tiene formato JWT válido (suele ser copiar/pegar incompleto o con saltos de línea). Revisa en Easypanel la variable SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  if (!/^https?:\/\//i.test(url)) {
    throw new Error(
      "SUPABASE_URL debe ser una URL https (ej. https://xxxx.supabase.co)."
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
