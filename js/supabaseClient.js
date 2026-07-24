// Caminho: js/supabaseClient.js
const SUPABASE_URL = 'https://uxayfqeqqcgpwysxnfjw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4YXlmcWVxcWNncHd5c3huZmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0ODByRmA0ODprRmA4bm9vYjJBNmlpLWJmU1BBWEEyS2cgU0M';

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
