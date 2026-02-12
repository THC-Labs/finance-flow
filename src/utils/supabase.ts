import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Extreme check to prevent build-time crashes
const isUrlValid = (url: string) => url && (url.startsWith('http://') || url.startsWith('https://'));

const safeUrl = isUrlValid(supabaseUrl) ? supabaseUrl : 'https://placeholder-project.supabase.co';
const safeKey = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient(safeUrl, safeKey);
