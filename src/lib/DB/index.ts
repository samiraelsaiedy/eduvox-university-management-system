import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase_types";
export const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);
