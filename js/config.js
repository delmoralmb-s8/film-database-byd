// ============================================================
// Supabase Configuration
// Replace these values with your own from:
// https://app.supabase.com → Project Settings → API
// ============================================================

const SUPABASE_URL = 'https://baapcdepyieanqdcrlbo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhYXBjZGVweWllYW5xZGNybGJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NDUyMTMsImV4cCI6MjA5MjAyMTIxM30.OxI7DYPBT7UyGNk350b0rHd7YdGKzhNuKO7iH57Ui6I';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
