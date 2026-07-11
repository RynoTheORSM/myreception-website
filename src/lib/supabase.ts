import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Same Supabase project as my-reception-hub; the website only inserts
// into launch_subscribers (public INSERT policy), no auth.
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Null instead of a module-load throw: a missing env var must not blank the
// whole page — only the demo button and the signup form need Supabase, and
// each shows its own "temporarily unavailable" state when this is null.
export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;

if (!supabase) {
  console.error(
    "Supabase client not initialised: VITE_SUPABASE_URL and/or " +
      "VITE_SUPABASE_PUBLISHABLE_KEY is missing. The Talk to Lauren demo " +
      "and the signup form are disabled until both are set.",
  );
}
