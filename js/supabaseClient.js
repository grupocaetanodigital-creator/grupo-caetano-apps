fetch('https://uxayfqeqqcgpwysxnfjw.supabase.co/rest/v1/condominios?select=*', {
  headers: {
    'apikey': eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4YXlmcWVxcWNncHd5c3huZmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NDU5MjYsImV4cCI6MjEwMDQyMTkyNn0.edwTbjwfNb48dprFmARnoobJjBNii-bfSPAXAO2sgO8
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4YXlmcWVxcWNncHd5c3huZmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NDU5MjYsImV4cCI6MjEwMDQyMTkyNn0.edwTbjwfNb48dprFmARnoobJjBNii-bfSPAXAO2sgO8
  }
}).then(res => res.json()).then(console.log);
