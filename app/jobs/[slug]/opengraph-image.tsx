import { ImageResponse } from 'next/og'
import { extractIdFromSlugParam, getJobById } from '@/lib/jobs'
import fs from 'fs'
import path from 'path'

const logoPath = path.join(process.cwd(), 'public', 'logo-dark.svg')
const logoSvg = fs.readFileSync(logoPath, 'utf8')
const logoDataUrl = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const GRADIENTS = [
  ['#1a232d', '#4fb8ae'],
  ['#201608', '#BF953F'],
  ['#2d1b3d', '#8a5fb0'],
  ['#0f2b3d', '#2b8fa8'],
  ['#3d1f1f', '#c25b3f'],
  ['#1f3d2e', '#4a9b6e'],
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
  const job = await getJobById(extractIdFromSlugParam(slug) || '')

  const title = job?.title || 'Обява за работа'
  const [from, to] = pickGradient(job?.id || slug)
  const badgeStyle = {
    display: 'flex', fontSize: 34, color: '#fff',
    background: 'rgba(255,255,255,0.18)', padding: '8px 20px', borderRadius: 999, textShadow: '3px 3px 3px rgb(15, 15, 15)',
  }

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '2rem',
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`
      }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', }}>
          <img
            src={logoDataUrl}
            width={320}
            style={{ objectFit: 'contain' }}
          />
          {job?.company?.logo_url && (
            <div style={{ display: 'flex', width: 220, height: 150, borderRadius: 16, background: '#fff', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
              <img
                src={job.company.logo_url}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          )}
        </div>

        <hr style={{ borderTop: '1px solid white', margin: '0.85rem 0 0' }} />

        {/* TITLE */}
        <div style={{ display: 'flex', width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: title.length > 60 ? 48 : 64, fontWeight: 700, color: '#fff', lineHeight: 1.15, maxWidth: '95%', textShadow: '5px 5px rgb(15, 15, 15)' }}>
            {title}
          </span>
        </div>

        <div style={{ display: 'flex', width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1.15, maxWidth: '95%' }}>
            {job?.description
              ? job.description.replace(/\s+/g, ' ').slice(0, 140) + '...'
              : ''}
          </span>
        </div>

        <hr style={{ borderTop: '1px solid white', margin: '0.85rem 0 0' }} />

        {/* INFO */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
          {job?.city && <div style={badgeStyle}>{job.city}</div>}
          {job?.salary_visible && job?.salary && (
            <div style={badgeStyle}>
              {job.salary_max
                ? `${job.salary} - ${job.salary_max} €/нето`
                : `${job.salary} €/нето`}
            </div>
          )}
        </div>
      </div>
    ),
    size
  )
}