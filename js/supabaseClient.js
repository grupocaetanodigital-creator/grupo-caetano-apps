// Caminho: js/supabaseClient.js
const SUPABASE_URL = 'https://uxayfqeqqcgpwysxnfjw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_4MV0hTSJTXaez9YSdAnu6A_T-UdhySi';

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
