import fs from 'fs'
import path from 'path'

const backgroundFiles = ['theme-01.png','theme-02.png','theme-03.png','theme-04.png','theme-05.png','theme-06.png','theme-07.png','theme-08.png', ]

const backgroundBuffers = Object.fromEntries(
  backgroundFiles.map((file) => {
    const buffer = fs.readFileSync(
      path.join(
        process.cwd(),
        'public',
        'og-backgrounds',
        file
      )
    )

    return [
      file,
      `data:image/png;base64,${buffer.toString('base64')}`,
    ]
  })
)

export const OG_SIZE = {
  width: 1200,
  height: 630,
}

const ibmRegular = fs.readFileSync(
  path.join(
    process.cwd(),
    'public/fonts/IBMPlexMono-Regular.ttf'
  )
)

const ibmBold = fs.readFileSync(
  path.join(
    process.cwd(),
    'public/fonts/IBMPlexMono-Bold.ttf'
  )
)

const ibmItalic = fs.readFileSync(
  path.join(
    process.cwd(),
    'public/fonts/IBMPlexMono-Italic.ttf'
  )
)

export const OG_FONTS = [
  {
    name: 'IBMRegular',
    data: ibmRegular,
    weight: 400 as const,
    style: 'normal' as const,
  },
  {
    name: 'IBMBold',
    data: ibmBold,
    weight: 700 as const,
    style: 'normal' as const,
  },
  {
    name: 'IBMItalic',
    data: ibmItalic,
    weight: 400 as const,
    style: 'italic' as const,
  },
]

const THEMES = [
  {
    background: 'theme-01.png',
    accent: '#0deec5',
  },
  {
    background: 'theme-02.png',
    accent: '#df23f0',
  },
  {
    background: 'theme-03.png',
    accent: '#be1c16',
  },
  {
    background: 'theme-04.png',
    accent: '#299ace',
  },
  {
    background: 'theme-05.png',
    accent: '#d89a36',
  },
  {
    background: 'theme-06.png',
    accent: '#703edb',
  },
  {
    background: 'theme-07.png',
    accent: '#b4f75d',
  },
  {
    background: 'theme-08.png',
    accent: '#45dd96',
  },
]

function pickTheme(seed: string) {
  let hash = 0

  for (let i = 0; i < seed.length; i++) {
    hash =
      (hash * 31 + seed.charCodeAt(i)) >>> 0
  }

  return THEMES[hash % THEMES.length]
}

export type JobOgCardJob = {
  id: string
  title?: string | null
  city?: string | null
  salary?: number | null
  salary_max?: number | null
  salary_visible?: boolean
  description?: string | null
  company?: {
    company_name?: string | null
    logo_url?: string | null
  } | null
}

export function JobOgCard({
  job,
}: {
  job: JobOgCardJob
}) {
  const title =
    job.title || 'Обява за работа'

  const theme = pickTheme(job.id)

  const backgroundDataUrl =
    backgroundBuffers[theme.background]

  const city = job.city || ''

  const salary =
    job.salary_visible && job.salary
      ? job.salary_max
        ? `${job.salary} - ${job.salary_max} €/нето`
        : `${job.salary} €/нето`
      : ''

  const description = job.description
    ? job.description
        .replace(/\s+/g, ' ')
        .slice(0, 157)
        .trim() + '...'
    : ''

  const companyName =
    job.company?.company_name ||
    'Работодател'

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `url(${backgroundDataUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'IBMRegular',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '42px 52px',
        }}
      >

        {/* HEADER */}

        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
          }}
        >
          {job.company?.logo_url && (
            <div
              style={{
                display: 'flex',
                width: 200,
                height: 135,
                borderRadius: 18,
                background: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 5,
                marginLeft: 'auto',
              }}
            >
              <img
                src={job.company.logo_url}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          )}
        </div>

        {/* SMALL LABEL */}

        <div
          style={{
            display: 'flex',
            marginTop: 18,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 9,
              height: 9,
              borderRadius: 5,
              background: theme.accent,
              marginRight: 10,
              boxShadow:
                `0 0 12px ${theme.accent}`,
            }}
          />

          <span
            style={{
              fontFamily: 'IBMBold',
              fontSize: 24,
              letterSpacing: 2,
              color: theme.accent,
            }}
          >
            НОВА РАБОТА
          </span>
        </div>

        {/* TITLE */}

        <div
          style={{
            display: 'flex',
            width: '85%',
            flexDirection: 'column',
            marginTop: 20,
          }}
        >
          <span
            style={{
              fontFamily: 'IBMBold',
              fontSize:
                title.length > 65
                  ? 31
                  : title.length > 45
                    ? 37
                    : 45,
              lineHeight: 1.08,
              color: '#FFFFFF',
              textShadow:
                '4px 4px 0 rgba(0,0,0,0.22)',
            }}
          >
            {title}
          </span>
        </div>

        {/* COMPANY */}

        <div
          style={{
            display: 'flex',
            marginTop: 17,
            width: '68%',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 4,
              height: 34,
              borderRadius: 2,
              background: theme.accent,
              marginRight: 12,
            }}
          />

          <span
            style={{
              fontFamily: 'IBMRegular',
              fontSize: 27,
              color: '#FFFFFF',
              opacity: 0.88,
            }}
          >
            {companyName}
          </span>
        </div>

        {/* DESCRIPTION */}

        {description && (
          <div
            style={{
              display: 'flex',
              width: '70%',
              marginTop: 22,
            }}
          >
            <span
              style={{
                fontFamily: 'IBMItalic',
                fontSize: 23,
                lineHeight: 1.25,
                color: '#FFFFFF',
                opacity: 0.92,
              }}
            >
              {description}
            </span>
          </div>
        )}

        {/* BOTTOM INFO */}

        <div
          style={{
            paddingTop: '1rem',
            display: 'flex',
            marginTop: 'auto',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {city && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 18px',
                borderRadius: 999,
                background:
                  'rgba(255,255,255,0.12)',
                border:
                  '1px solid rgba(255,255,255,0.18)',
                marginRight: 12,
              }}
            >
              <span
                style={{
                  fontFamily: 'IBMRegular',
                  fontSize: 25,
                  color: '#FFFFFF',
                }}
              >
                📍 {city}
              </span>
            </div>
          )}

          {salary && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 20px',
                borderRadius: 999,
                background: theme.accent,
                boxShadow:
                  `0 5px 18px ${theme.accent}55`,
              }}
            >
              <span
                style={{
                  fontFamily: 'IBMBold',
                  fontSize: 25,
                  color: '#FFFFFF',
                }}
              >
                {salary}
              </span>
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div
          style={{
            display: 'flex',
            width: '100%',
            marginTop: 17,
            paddingTop: 13,
            borderTop:
              '1px solid rgba(255,255,255,0.18)',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'IBMBold',
              fontSize: 19,
              letterSpacing: 1.5,
              color: '#FFFFFF',
              opacity: 0.65,
            }}
          >
            JOBSTATE®
          </span>

          <span
            style={{
              fontFamily: 'IBMRegular',
              fontSize: 18,
              color: '#FFFFFF',
              opacity: 0.85,
            }}
          >
            Открий нови възможности
          </span>
        </div>

      </div>
    </div>
  )
}