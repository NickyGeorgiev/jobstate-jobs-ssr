import { ImageResponse } from 'next/og'
import { extractIdFromSlugParam, getJobById } from '@/lib/jobs'
import { JobOgCard, OG_SIZE, OG_FONTS } from '@/components/JobOgCard'

export const revalidate = 3600

// Празен списък: страницата не се генерира при build, а при първа заявка,
// и после се кешира за `revalidate` секунди (ISR). Служи като fallback —
// обикновено generateMetadata в page.tsx вече сочи директно към готовата
// картинка в Supabase Storage (og_image_url) и този route не се ползва,
// освен за обяви, на които все още няма предварително генерирана картинка.
export async function generateStaticParams() {
  return []
}

export const size = OG_SIZE
export const contentType = 'image/png'

type Props = { params: Promise<{ slug: string }> }

export default async function OpengraphImage({ params }: Props) {
  const { slug } = await params
  const job = await getJobById(extractIdFromSlugParam(slug) || '')

  return new ImageResponse(
    <JobOgCard job={job || { id: slug, title: 'Обява за работа' }} />,
    { ...size, fonts: OG_FONTS }
  )
}
