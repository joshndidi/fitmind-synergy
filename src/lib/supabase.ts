
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Use environment variables for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fall back to hardcoded values if environment variables aren't available
const fallbackUrl = "https://swgswxqxebwaodsyxnib.supabase.co";
const fallbackKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Z3N3eHF4ZWJ3YW9kc3l4bmliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMTYyOTQsImV4cCI6MjA1NzY5MjI5NH0.XtIGHhf-0xxtvT90ktqJkZN07gScCLhJSgcnX9nzdr4";

// Use the first available values
const url = supabaseUrl || fallbackUrl;
const key = supabaseAnonKey || fallbackKey;

export const supabase = createClient<Database>(url, key, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
