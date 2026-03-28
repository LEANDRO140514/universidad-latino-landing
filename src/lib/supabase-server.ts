import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase solo para Route Handlers / servidor.
 * Lee variables en tiempo de ejecución (no depende de NEXT_PUBLIC incrustadas en el build).
 *
 * En EasyPanel / Docker: define en runtime (no solo en build args):
 * - SUPABASE_URL (recomendado) o NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY (API confiable) o SUPABASE_ANON_KEY o NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export function getSupabaseServer(): SupabaseClient {
  const url = (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    ""
  ).trim();
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  ).trim();

  if (!url || !key) {
    throw new Error(
      "Supabase no configurado en el servidor: faltan URL o clave (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY o anon)."
    );
  }

  return createClient(url, key);
}
