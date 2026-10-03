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
  ['#17202A', '#31566B', '#4FB8AE'],
  ['#201608', '#6B4215', '#BF953F'],
  ['#2D1B3D', '#593B73', '#A879D0'],
  ['#0F2B3D', '#185C73', '#2B8FA8'],
  ['#3D1F1F', '#7A3630', '#C25B3F'],
  ['#1F3D2E', '#326B4C', '#4A9B6E'],

  ['#111827', '#374151', '#818CF8'],
  ['#172554', '#1D4ED8', '#60A5FA'],
  ['#312E81', '#6D28D9', '#C084FC'],
  ['#3B0764', '#86198F', '#E879F9'],
  ['#4A044E', '#9D174D', '#FB7185'],

  ['#3F1D0B', '#B45309', '#F59E0B'],
  ['#431407', '#C2410C', '#FB923C'],
  ['#422006', '#854D0E', '#FACC15'],
  ['#052E16', '#15803D', '#4ADE80'],
  ['#042F2E', '#0F766E', '#2DD4BF'],

  ['#082F49', '#0369A1', '#38BDF8'],
  ['#18181B', '#52525B', '#A1A1AA'],
  ['#1C1917', '#57534E', '#A8A29E'],
  ['#0F172A', '#334155', '#64748B'],

  ['#3F0D12', '#9F1239', '#FB7185'],
  ['#27101F', '#9D174D', '#F472B6'],
  ['#172554', '#3730A3', '#818CF8'],
  ['#1E1B4B', '#6D28D9', '#A78BFA'],
  ['#052E16', '#166534', '#A3E635'],

  ['#042F2E', '#115E59', '#5EEAD4'],
  ['#0C4A6E', '#155E75', '#67E8F9'],
  ['#3F3F46', '#7C3AED', '#F0ABFC'],
  ['#451A03', '#9A3412', '#FDBA74'],
  ['#4C0519', '#BE123C', '#FDA4AF'],
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
  const [from, middle, to] = pickGradient(job?.id || slug)
  const badgeStyle = {
    display: 'flex', fontSize: 34, color: '#fff',
    background: 'rgba(255,255,255,0.18)', padding: '8px 20px', borderRadius: 999, textShadow: '3px 3px 3px rgb(15, 15, 15)',
  }

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '2rem',
        background: `linear-gradient( 135deg, ${from} 0%, ${middle} 50%, ${to} 100% )`
      }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', }}>
          <img
            src={logoDataUrl}
            width={320}
            style={{ objectFit: 'contain' }}
          />
          {job?.company?.logo_url && (
            <div style={{ display: 'flex', width: 220, height: 150, borderRadius: 16, background: 'rgba(200, 200, 200, 0.4)', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
              <img
                src={job.company.logo_url}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid white', margin: '1rem 0 0' }} />

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

        <div style={{ borderTop: '1px solid white', margin: '0.85rem 0 0' }} />

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