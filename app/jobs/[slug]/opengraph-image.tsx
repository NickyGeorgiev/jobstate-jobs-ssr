import { ImageResponse } from 'next/og'
import { extractIdFromSlugParam, getJobById } from '@/lib/jobs'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Няколко готови двойки цветове за градиента — избират се на случаен
// принцип по job id, за да е стабилно (същата обява винаги ще показва
// същия градиент, вместо да се сменя при всяко презареждане).
const GRADIENTS = [
  ['#1a232d', '#4fb8ae'], // тъмно синьо -> тюркоаз (брандиран)
  ['#201608', '#BF953F'], // тъмно кафяво -> злато (брандиран)
  ['#2d1b3d', '#8a5fb0'], // тъмно лилаво -> лилаво
  ['#0f2b3d', '#2b8fa8'], // тъмно синьо -> синьо
  ['#3d1f1f', '#c25b3f'], // тъмно бордо -> корал
  ['#1f3d2e', '#4a9b6e'], // тъмно зелено -> зелено
]

function pickGradient(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return GRADIENTS[hash % GRADIENTS.length]
}

type Props = { params: Promise<{ slug: string }> }

export default async function OpengraphImage({ params }: Props) {
  const { slug } = await params
  const id = extractIdFromSlugParam(slug)
  const job = id ? await getJobById(id) : null

  const title = job?.title || 'Обява за работа'
  const [from, to] = pickGradient(job?.id || slug)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.02em',
            }}
          >
            Jobstate
          </div>
        </div>

        <div
          style={{
            fontSize: title.length > 60 ? 48 : 64,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.15,
            display: 'flex',
            maxWidth: '95%',
          }}
        >
          {title}
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          {job?.city && (
            <div
              style={{
                fontSize: 26,
                color: '#ffffff',
                background: 'rgba(255,255,255,0.18)',
                padding: '8px 20px',
                borderRadius: '999px',
              }}
            >
              {job.city}
            </div>
          )}
          {job?.salary_visible && job?.salary && (
            <div
              style={{
                fontSize: 26,
                color: '#ffffff',
                background: 'rgba(255,255,255,0.18)',
                padding: '8px 20px',
                borderRadius: '999px',
              }}
            >
              {job.salary} € / месец
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  )
}
