import { ImageResponse } from 'next/og'
import { extractIdFromSlugParam, getJobById } from '@/lib/jobs'
import fs from 'fs'
import path from 'path'

const ibmRegular = fs.readFileSync(
  path.join(process.cwd(), 'public/fonts/IBMPlexMono-Regular.ttf')
)

const ibmBold = fs.readFileSync(
  path.join(process.cwd(), 'public/fonts/IBMPlexMono-Bold.ttf')
)

const ibmItalic = fs.readFileSync(
  path.join(process.cwd(), 'public/fonts/IBMPlexMono-Italic.ttf')
)

const logoPath = path.join(process.cwd(), 'public', 'logo-dark-og.png')
const logoBuffer = fs.readFileSync(logoPath)
const logoDataUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/* -------------------------------------------------------
   COLOR THEMES
------------------------------------------------------- */

const THEMES = [
  {
    bg1: '#081B24',
    bg2: '#123D4B',
    accent: '#4FB8AE',
    accent2: '#8BE5DC',
  },
  {
    bg1: '#181108',
    bg2: '#4A2B0D',
    accent: '#D49A3A',
    accent2: '#F4D28B',
  },
  {
    bg1: '#160D24',
    bg2: '#3A2055',
    accent: '#A879D0',
    accent2: '#D9B8F5',
  },
  {
    bg1: '#081A2B',
    bg2: '#124C67',
    accent: '#2B9BC0',
    accent2: '#8DE0F5',
  },
  {
    bg1: '#210D0D',
    bg2: '#59211F',
    accent: '#D05A4A',
    accent2: '#F2A195',
  },
  {
    bg1: '#081C14',
    bg2: '#16452F',
    accent: '#4A9B6E',
    accent2: '#9BE2B8',
  },
  {
    bg1: '#0B1020',
    bg2: '#252E48',
    accent: '#818CF8',
    accent2: '#B9BFFF',
  },
  {
    bg1: '#10114A',
    bg2: '#2938A0',
    accent: '#60A5FA',
    accent2: '#A9D4FF',
  },
]

function pickTheme(seed: string) {
  let hash = 0

  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }

  return THEMES[hash % THEMES.length]
}

/* -------------------------------------------------------
   COMPONENT
------------------------------------------------------- */

type Props = {
  params: Promise<{ slug: string }>
}

export default async function OpengraphImage({ params }: Props) {
  const { slug } = await params

  const job = await getJobById(
    extractIdFromSlugParam(slug) || ''
  )

  const title = job?.title || 'Обява за работа'

  const theme = pickTheme(job?.id || slug)

  const city = job?.city || ''

  const salary =
    job?.salary_visible && job?.salary
      ? job.salary_max
        ? `${job.salary} - ${job.salary_max} €/нето`
        : `${job.salary} €/нето`
      : ''

  const description = job?.description
    ? job.description
        .replace(/\s+/g, ' ')
        .slice(0, 157)
        .trim() + '...'
    : ''

  const companyName =
    job?.company?.company_name || 'Работодател'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(125deg, ${theme.bg1} 0%, ${theme.bg2} 100%)`,
          fontFamily: 'IBMRegular',
        }}
      >

        {/* =================================================
            BACKGROUND DECORATION
        ================================================= */}

        {/* Large glow circle */}
        <div
          style={{
            position: 'absolute',
            width: 620,
            height: 620,
            borderRadius: 310,
            right: -230,
            top: -250,
            background: theme.accent,
            opacity: 0.13,
            display: 'flex',
          }}
        />

        {/* Second glow */}
        <div
          style={{
            position: 'absolute',
            width: 420,
            height: 420,
            borderRadius: 210,
            left: -180,
            bottom: -230,
            background: theme.accent2,
            opacity: 0.07,
            display: 'flex',
          }}
        />

        {/* Diagonal light panel */}
        <div
          style={{
            position: 'absolute',
            width: 850,
            height: 260,
            right: -260,
            top: 170,
            transform: 'rotate(-18deg)',
            background: theme.accent,
            opacity: 0.055,
            display: 'flex',
          }}
        />

        {/* Second diagonal panel */}
        <div
          style={{
            position: 'absolute',
            width: 700,
            height: 90,
            right: -180,
            top: 280,
            transform: 'rotate(-18deg)',
            background: '#FFFFFF',
            opacity: 0.035,
            display: 'flex',
          }}
        />

        {/* Decorative vertical line */}
        <div
          style={{
            position: 'absolute',
            width: 3,
            height: 430,
            right: 48,
            top: 100,
            background: theme.accent,
            opacity: 0.35,
            display: 'flex',
          }}
        />

        {/* =================================================
            DOT GRID
        ================================================= */}

        <div
          style={{
            position: 'absolute',
            right: 45,
            bottom: 48,
            width: 190,
            height: 155,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 13,
            opacity: 0.22,
          }}
        >
          {Array.from({ length: 72 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                background: theme.accent2,
                display: 'flex',
              }}
            />
          ))}
        </div>

           {/* =================================================
            BACKGROUND — LARGE GEOMETRIC RING RIGHT CORNER
        ================================================= */}

        <div
          style={{
            position: 'absolute',
            width: 490,
            height: 490,
            borderRadius: 295,
            right: -80,
            bottom: -145,
            border: `2px solid ${theme.accent2}`,
            opacity: 0.14,
            display: 'flex',
          }}
        />

        <div
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: 250,
            right: -35,
            bottom: -100,
            border: `1px solid ${theme.accent2}`,
            opacity: 0.11,
            display: 'flex',
          }}
        />


           {/* =================================================
            BACKGROUND — LARGE GEOMETRIC RING LEFT CORNER
        ================================================= */}

        <div
          style={{
            position: 'absolute',
            width: 440,
            height: 440,
            borderRadius: 245,
            left: -80,
            top: -265,
            border: `2px solid ${theme.accent2}`,
            opacity: 0.11,
            display: 'flex',
          }}
        />

        <div
          style={{
            position: 'absolute',
            width: 350,
            height: 350,
            borderRadius: 200,
            left: -35,
            top: -220,
            border: `1px solid ${theme.accent2}`,
            opacity: 0.08,
            display: 'flex',
          }}
        />

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

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

          

          {/* =================================================
              HEADER
          ================================================= */}

          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >

            {/* Jobstate logo */}
            <img
              src={logoDataUrl}
              width={270}
              style={{
                objectFit: 'contain',
              }}
            />

            {/* Company logo */}
            {job?.company?.logo_url && (
              <div
                style={{
                  display: 'flex',
                  width: 200,
                  height: 135,
                  borderRadius: 18,
                  background: 'rgba(255,255,255,0.88)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
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

          {/* =================================================
              SMALL LABEL
          ================================================= */}

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
                background: theme.accent2,
                marginRight: 10,
                boxShadow: `0 0 12px ${theme.accent2}`
              }}
            />

            <span
              style={{
                fontFamily: 'IBMBold',
                fontSize: 24,
                letterSpacing: 2,
                color: theme.accent2,
              }}
            >
              НОВА РАБОТА
            </span>

          </div>

          {/* =================================================
              TITLE
          ================================================= */}

          <div
            style={{
              display: 'flex',
              width: '90%',
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
                textShadow: '4px 4px 0 rgba(0,0,0,0.22)',
              }}
            >
              {title}
            </span>

          </div>

          {/* =================================================
              COMPANY
          ================================================= */}

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

          {/* =================================================
              DESCRIPTION
          ================================================= */}

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
                  opacity: 0.72,
                }}
              >
                {description}
              </span>

            </div>
          )}

          {/* =================================================
              BOTTOM INFO
          ================================================= */}

          <div
            style={{
              paddingTop: '1rem',
              display: 'flex',
              marginTop: 'auto',
              alignItems: 'center',
              width: '100%',
            }}
          >

            {/* City */}
            {city && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 18px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
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

            {/* Salary */}
            {salary && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 20px',
                  borderRadius: 999,
                  background: theme.accent,
                  boxShadow: `0 5px 18px ${theme.accent}55`,
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

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            style={{
              display: 'flex',
              width: '100%',
              marginTop: 17,
              paddingTop: 13,
              borderTop: '1px solid rgba(255,255,255,0.18)',
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
                opacity: 0.55,
              }}
            >
              Открий нови възможности
            </span>

          </div>

        </div>

      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'IBMRegular',
          data: ibmRegular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'IBMBold',
          data: ibmBold,
          weight: 700,
          style: 'normal',
        },
        {
          name: 'IBMItalic',
          data: ibmItalic,
          weight: 400,
          style: 'italic',
        },
      ],
    }
  )
}