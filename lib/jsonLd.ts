// JSON-LD се записва вътре в <script>. Ако в данните (заглавие, описание, име на фирма)
// има "</script>", браузърът затваря тага и каквото следва се изпълнява като код.
// Затова "<" се записва като \u003c — резултатът е същият валиден JSON, но без опасния символ.
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
