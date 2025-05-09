import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

export function createSupabaseClient(
  password: string,
  showPublicInfo: boolean = false
) {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          password,
          show_public_info: showPublicInfo ? 'true' : 'false',
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
