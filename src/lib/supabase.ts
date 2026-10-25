/// <reference types="vite/client" />

/**
 * Supabase Client
 *
 * Singleton Supabase client instance for the TalentHub application.
 * Uses VITE_ prefixed environment variables so Vite exposes them to the browser bundle.
 *
 * Usage:
 *   import { supabase } from '@/src/lib/supabase';
 *   const { data, error } = await supabase.from('table_name').select('*');
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables.\n" +
      "Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    /**
     * Persist the user session in localStorage so that the user stays
     * logged in across page refreshes in the browser.
     */
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
