// ============================================================
// Supabase Configuration
// Replace these values with your own from:
// https://app.supabase.com → Project Settings → API
// ============================================================

const SUPABASE_URL = 'https://baapcdepyieanqdcrlbo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_d86hQPtiYJp6yZ5ifmo9VA_9ObYLqOn';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
