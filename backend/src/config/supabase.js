import { createClient } from '@supabase/supabase-js';

/**
 * Membuat instance client Supabase menggunakan service role key untuk server backend.
 */
export function createSupabaseClient(supabaseUrl, supabaseServiceRoleKey) {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
