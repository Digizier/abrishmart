import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://mioulpysliiedyekztyo.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pb3VscHlzbGlpZWR5ZWt6dHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1MzU3MjEsImV4cCI6MjEwOTExMTcyMX0.UEb47qqSwqPVpeSc9H4daVOXg5pq5hA-mAYIk68OPgY";

const isValidHttpUrl = (url?: string): boolean => {
  if (!url) return false;
  const cleaned = url.trim().replace(/^["']|["']$/g, "");
  return cleaned.startsWith("http://") || cleaned.startsWith("https://");
};

const getValidApiUrl = (envUrl?: string, fallbackUrl: string = DEFAULT_SUPABASE_URL): string => {
  if (isValidHttpUrl(envUrl)) {
    return envUrl!.trim().replace(/^["']|["']$/g, "");
  }
  return fallbackUrl;
};

export const SUPABASE_URL = getValidApiUrl(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  DEFAULT_SUPABASE_URL
);

export const SUPABASE_ANON_KEY =
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "undefined")
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim()
    : DEFAULT_SUPABASE_ANON_KEY;

// Singleton client instance for browser and build-time safety
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
