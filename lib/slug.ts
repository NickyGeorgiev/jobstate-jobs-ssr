// Съответства 1:1 на CYR_TO_LAT в jobnet2/src/pages/JobListingForm.jsx —
// same transliteration, за да съвпадат slug-овете между двата сайта.
const CYR_TO_LAT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p',
  р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch',
  ш: 'sh', щ: 'sht', ъ: 'a', ь: 'y', ю: 'yu', я: 'ya',
}

export function slugify(text: string): string {
  const transliterated = text
    .toLowerCase()
    .split('')
    .map((char) => CYR_TO_LAT[char] ?? char)
    .join('')

  return transliterated
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Намира реалната (кирилска) стойност от даден списък, чийто slug
// съвпада с подадения slug от URL-а. Използва се, за да мапнем
// /rabota/sofia обратно към "София", без да пазим отделен твърд
// списък градове в SSR проекта.
export function matchSlug(slug: string, values: string[]): string | null {
  return values.find((v) => slugify(v) === slug) || null
}