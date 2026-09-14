import { createClient } from '@supabase/supabase-js'

// Тези две стойности идват от .env.local (виж .env.local.example).
// Ключът тук е PUBLISHABLE/ANON ключ — безопасен е за публичен код,
// НЕ е service_role ключ.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Този сайт не логва потребители, само чете публични обяви.
  },
})
