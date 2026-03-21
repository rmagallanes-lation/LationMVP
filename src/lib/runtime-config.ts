const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const missingSupabaseConfig = [
  !supabaseUrl ? "VITE_SUPABASE_URL" : null,
  !supabaseAnonKey ? "VITE_SUPABASE_ANON_KEY" : null,
].filter(Boolean) as string[];

export const isSupabaseConfigured = missingSupabaseConfig.length === 0;

export const supabaseConfigError = isSupabaseConfigured
  ? null
  : `Missing frontend configuration: ${missingSupabaseConfig.join(", ")}`;

export const runtimeConfig = {
  supabaseUrl,
  supabaseAnonKey,
} as const;
