import sanitizeHtml from 'sanitize-html'

// Описанията на обявите са HTML (от редактора) или, при старите обяви, чист текст с нови редове.

const HTML_TAG_RE = /<\/?(p|br|ul|ol|li|strong|b|em|i|u|h[1-6])\b[^>]*>/i

export function looksLikeHtml(value: string | null | undefined): boolean {
  return HTML_TAG_RE.test(value || '')
}

// Само тези тагове. Единственият разрешен атрибут е class="check-list" върху <ul>
// (списък с отметки). Без линкове, картинки, стилове, скриптове.
// RLS позволява на фирмите да пишат директно в базата, затова чистим при показване.
export function sanitizeJobDescription(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'h2', 'h3'],
    allowedAttributes: { ul: ['class'] },
    allowedClasses: { ul: ['check-list'] },
  })
}

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
}

// HTML или стар текст -> чист текст (за meta description, карти, OG картинка).
// Резултатът се показва само като текст (React го ескейпва), не като HTML.
export function descriptionToPlainText(value: string | null | undefined): string {
  if (!value) return ''
  if (!looksLikeHtml(value)) return value.replace(/\s+/g, ' ').trim()
  return value
    .replace(/<\/(p|li|h[1-6])>|<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&(amp|lt|gt|quot|nbsp|#39);/g, (m) => ENTITIES[m] ?? m)
    .replace(/\s+/g, ' ')
    .trim()
}
