
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Use the same configuration as in the integrations/supabase/client.ts file
const supabaseUrl = "https://swgswxqxebwaodsyxnib.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Z3N3eHF4ZWJ3YW9kc3l4bmliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMTYyOTQsImV4cCI6MjA1NzY5MjI5NH0.XtIGHhf-0xxtvT90ktqJkZN07gScCLhJSgcnX9nzdr4";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
