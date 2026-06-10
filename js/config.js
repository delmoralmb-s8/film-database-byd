// ============================================================
// Supabase Configuration
// Replace these values with your own from:
// https://app.supabase.com → Project Settings → API
// ============================================================

const SUPABASE_URL = 'https://frfxzritpvhjamllmyjb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZnh6cml0cHZoamFtbGxteWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNDgwODIsImV4cCI6MjA5NjYyNDA4Mn0.g-cv_1wK0E1lBlN3omlY_7NV8YVI-paYpo-GqgDAeLk';

// Overwrite window.supabase (SDK) with the client instance so all scripts share it
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabase = window.supabase;
