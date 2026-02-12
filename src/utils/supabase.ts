import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// If URL is missing, we export a placeholder or throw a more helpful error.
// During build (prerendering), if the URL is empty, the build fails.
// We can use a dummy URL for build time if necessary, but better to be defensive.
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);
