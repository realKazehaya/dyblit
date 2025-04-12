import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Configuration:', {
  url: supabaseUrl ? 'Present' : 'Missing',
  key: supabaseAnonKey ? 'Present' : 'Missing'
});

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is not defined. Please check your environment variables.');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is not defined. Please check your environment variables.');
}

try {
  // Validate the URL
  new URL(supabaseUrl);
} catch (error) {
  console.error('Invalid Supabase URL:', error);
  throw new Error(`Invalid VITE_SUPABASE_URL: ${supabaseUrl}. Please provide a valid URL.`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', { event, session: session ? 'Present' : 'None' });
});