// Caminho: js/supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://uxayfqeqqcgpwysxnfjw.supabase.co';
const SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4YXlmcWVxcWNncHd5c3huZmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NDU5MjYsImV4cCI6MjEwMDQyMTkyNn0.edwTbjwfNb48dprFmARnoobJjBNii-bfSPAXAO2sgO8;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
