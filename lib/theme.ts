import { supabase } from './supabase'

export async function getDarkTheme() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')

  if (error || !data) {
    console.error('Error loading theme:', error)
    return {}
  }

  return Object.fromEntries(
    data.map(({ key, value }) => [key, value])
  )
}