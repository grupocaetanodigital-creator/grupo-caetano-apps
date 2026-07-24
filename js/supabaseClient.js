// Caminho: js/supabaseClient.js
const SUPABASE_URL = 'https://uxayfqeqqcgpwysxnfjw.supabase.co';
const SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4YXlmcWVxcWNncHd5c3huZmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NDU5MjYsImV4cCI6MjEwMDQyMTkyNn0.edwTbjwfNb48dprFmARnoobJjBNii-bfSPAXAO2sgO8

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
