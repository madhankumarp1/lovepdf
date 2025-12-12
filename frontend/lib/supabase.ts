import { createClient } from '@supabase/supabase-js';

// Hardcoding keys for immediate resolution. 
// Ideally these should be in .env.local, but since that file isn't being read effectively in this environment:
const supabaseUrl = "https://fuurdpogwnnigbzdunyg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1dXJkcG9nd25uaWdiemR1bnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NTY3MTcsImV4cCI6MjA4MTEzMjcxN30.w8JKIZ1kXKWkvCwSP0fHqbpAN0_CmeqmuDOMhpnIV4s";

if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase credentials missing!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
