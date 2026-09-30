import { supabase } from './supabase'

export type ThemeValues = Record<string, string>

// Връща dark и light комплектите наведнъж, изчетени от site_settings.
export async function getThemeSettings(): Promise<{ dark: ThemeValues; light: ThemeValues }> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value, theme')
    .in('theme', ['dark', 'light'])

  if (error || !data) {
    console.error('Error loading theme:', error)
    return { dark: {}, light: {} }
  }

  const result: { dark: ThemeValues; light: ThemeValues } = { dark: {}, light: {} }
  for (const row of data) {
    if (row.theme === 'dark') result.dark[row.key] = row.value
    else if (row.theme === 'light') result.light[row.key] = row.value
  }
  return result
}
