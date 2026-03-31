import { NextResponse } from "next/server";

function runtimeEnv(name: string): string {
  const raw = process.env[name];
  if (raw === undefined || raw === null) return "";
  return String(raw).replace(/\r/g, "").replace(/^\uFEFF/, "").trim();
}

export async function GET() {
  const supabaseUrl =
    runtimeEnv("SUPABASE_URL") || runtimeEnv("NEXT_PUBLIC_SUPABASE_URL");
  const hasServiceKey = !!(
    runtimeEnv("SUPABASE_SERVICE_ROLE_KEY") || runtimeEnv("SUPABASE_ANON_KEY")
  );

  // Test raw fetch to Supabase REST endpoint
  let fetchStatus: number | null = null;
  let fetchError: string | null = null;
  let fetchCause: string | null = null;

  try {
    const key =
      runtimeEnv("SUPABASE_SERVICE_ROLE_KEY") ||
      runtimeEnv("SUPABASE_ANON_KEY") ||
      runtimeEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    const res = await fetch(`${supabaseUrl}/rest/v1/leads?limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    fetchStatus = res.status;
  } catch (err: any) {
    fetchError = err?.message ?? String(err);
    const cause = err?.cause;
    if (cause instanceof AggregateError) {
      fetchCause = cause.errors?.map((e: any) => e?.message ?? String(e)).join(" | ");
    } else if (cause) {
      fetchCause = cause?.message ?? String(cause);
    }
  }

  return NextResponse.json({
    supabaseUrl: supabaseUrl
      ? supabaseUrl.replace(/^(https?:\/\/[^.]+).*$/, "$1…[hidden]")
      : "(empty)",
    hasServiceKey,
    nodeVersion: process.version,
    fetchStatus,
    fetchError,
    fetchCause,
    env: {
      SUPABASE_URL_set: !!runtimeEnv("SUPABASE_URL"),
      NEXT_PUBLIC_SUPABASE_URL_set: !!runtimeEnv("NEXT_PUBLIC_SUPABASE_URL"),
      SUPABASE_SERVICE_ROLE_KEY_set: !!runtimeEnv("SUPABASE_SERVICE_ROLE_KEY"),
    },
  });
}
