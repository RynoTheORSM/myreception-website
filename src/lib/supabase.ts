import { createClient } from "@supabase/supabase-js";

// Same Supabase project as my-reception-hub; the website only inserts
// into launch_subscribers (public INSERT policy), no auth.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
