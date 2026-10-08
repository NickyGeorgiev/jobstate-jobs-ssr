import { ImageResponse } from 'next/og'
import { getJobById } from '@/lib/jobs'
import { JobOgCard, OG_SIZE, OG_FONTS } from '@/components/JobOgCard'

// Вътрешен route — вика се САМО от Edge Function-а generate-og-image (Supabase),
// не е за браузъри/crawler-и. Защитен с споделена тайна, за да не може кой да е
// да праща заявки и да товари сървъра с рендериране.
const INTERNAL_SECRET = process.env.OG_INTERNAL_SECRET

export async function GET(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const secret = req.headers.get('x-internal-secret')
  if (!INTERNAL_SECRET || secret !== INTERNAL_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { jobId } = await params
  const job = await getJobById(jobId)

  if (!job) {
    return new Response('Job not found', { status: 404 })
  }

  return new ImageResponse(<JobOgCard job={job} />, { ...OG_SIZE, fonts: OG_FONTS })
}
