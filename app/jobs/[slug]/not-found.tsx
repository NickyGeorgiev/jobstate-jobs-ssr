import Link from 'next/link'

const MAIN_SITE_URL =
  process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://jobstate.net'

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '5rem',
          fontWeight: 700,
          color: 'var(--color-gold)',
          margin: 0,
          lineHeight: 1,
        }}
      >
        404
      </p>

      <h2
        style={{
          fontFamily: 'var(--font-display)',
          marginBottom: '0.6rem',
        }}
      >
        Страницата не е намерена
      </h2>

      <p
        style={{
          color: 'var(--color-text-muted)',
          marginBottom: '1.75rem',
          maxWidth: '400px',
        }}
      >
        Адресът, който търсиш, не съществува или е бил преместен.
      </p>

      <Link
        href={`${MAIN_SITE_URL}/jobs`}
        className="btn-primary"
        style={{
          textDecoration: 'none',
          display: 'inline-block',
        }}
      >
        Виж всички обяви
      </Link>
    </main>
  )
}