import { supabase } from './supabase'

export type JobListing = {
  id: string
  company_id: string
  title: string
  description: string
  slug: string | null
  sector: string | null
  level: string | null
  duration: string | null
  city: string | null
  salary: number | null
  salary_max: number | null
  salary_visible: boolean
  application_mode: 'platform' | 'external'
  external_url: string | null
  status: 'draft' | 'published' | 'closed'
  published_at: string | null
  expires_at: string | null
  created_at: string
  view_count: number
  banner_url: string | null
  tier: 'free' | 'silver' | 'gold' | 'platinum' | 'diamond'
  tier_rank: number
}

export type CompanyInfo = {
  id: string
  company_name: string
  logo_url: string | null
  banner_url: string | null
  sector: string | null
  bio: string | null
  why_work_here: string | null
  perks: string | null
  values: string | null
  founded_year: number | null
  employee_count: string | null
  locations_count: number | null
  contact_phone: string | null
  contact_email: string | null
  contact_address: string | null
  social_website: string | null
  social_facebook: string | null
  social_linkedin: string | null
  social_instagram: string | null
}

export type JobWithCompany = JobListing & {
  company: CompanyInfo | null
}

const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function extractIdFromSlugParam(slugParam: string): string | null {
  const match = slugParam.match(UUID_REGEX)
  return match ? match[0] : null
}

export function buildJobUrl(job: JobListing): string {
  const base = job.slug || 'obiava'
  return `/jobs/${base}-${job.id}`
}

async function attachCompanies(jobs: JobListing[]): Promise<JobWithCompany[]> {
  const companyIds = [...new Set(jobs.map((j) => j.company_id))]

  if (companyIds.length === 0) {
    return jobs.map((job) => ({ ...job, company: null }))
  }

  const { data: companies } = await supabase
    .from('company_public_names')
    .select(`
    id,
    company_name,
    logo_url,
    banner_url,
    sector,
    bio,
    why_work_here,
    perks,
    values,
    founded_year,
    employee_count,
    locations_count,
    contact_phone,
    contact_email,
    contact_address,
    social_website,
    social_facebook,
    social_linkedin,
    social_instagram
  `)
    .in('id', companyIds)

  const companyMap = new Map((companies || []).map((c) => [c.id, c]))

  return jobs.map((job) => ({
    ...job,
    company: companyMap.get(job.company_id) || null,
  }))
}

export async function getPublishedJobs(): Promise<JobWithCompany[]> {
  const { data, error } = await supabase
    .from('job_listings')
    .select('*')
    .eq('status', 'published')
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('tier_rank', { ascending: false })
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error loading published jobs:', error)
    return []
  }

  return attachCompanies(data || [])
}

export async function getJobById(id: string): Promise<JobWithCompany | null> {
  const { data, error } = await supabase
    .from('job_listings')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .single()

  if (error || !data) {
    return null
  }

  const [withCompany] = await attachCompanies([data])
  return withCompany
}


export async function getCompanyJobs(companyId: string, currentJobId?: string): Promise<JobListing[]> {
  const query = supabase
    .from('job_listings')
    .select(
      'id, company_id, title, description, slug, sector, level, duration, city, salary, salary_max, salary_visible, application_mode, external_url, status, published_at, expires_at, created_at, view_count, banner_url, tier, tier_rank'
    )
    .eq('company_id', companyId)
    .eq('status', 'published')
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('tier_rank', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(7)

  const { data, error } = await query

  if (error) {
    console.error('Error loading company jobs:', error)
    return []
  }

  return (data || []).filter((job) => job.id !== currentJobId).slice(0, 6)
}

export async function getActiveCities(): Promise<{ city: string; count: number }[]> {
  const { data, error } = await supabase
    .from('job_listings')
    .select('city')
    .eq('status', 'published')
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .not('city', 'is', null)

  if (error || !data) return []

  const counts = new Map<string, number>()
  for (const row of data) {
    if (!row.city) continue
    counts.set(row.city, (counts.get(row.city) || 0) + 1)
  }

  return [...counts.entries()]
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getJobsByCityName(city: string): Promise<JobWithCompany[]> {
  const { data, error } = await supabase
    .from('job_listings')
    .select('*')
    .eq('status', 'published')
    .eq('city', city)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('tier_rank', { ascending: false })
    .order('published_at', { ascending: false })

  if (error || !data) return []

  return attachCompanies(data)
}

// Зарежда обява НЕЗАВИСИМО от статус/изтичане — за да различим
// "никога не е съществувала" (истинска 404) от "съществувала е, но
// вече е затворена/изтекла" (меко съобщение, не 404).
export async function getJobByIdAnyStatus(id: string): Promise<JobWithCompany | null> {
  const { data, error } = await supabase
    .from('job_listings')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null

  const [withCompany] = await attachCompanies([data])
  return withCompany
}

export function isJobActive(job: JobListing): boolean {
  if (job.status !== 'published') return false
  if (!job.expires_at) return true
  return new Date(job.expires_at) > new Date()
}

export async function getRelatedJobs(job: JobListing, limit = 4): Promise<JobWithCompany[]> {
  if (!job.sector) return []

  const { data, error } = await supabase
    .from('job_listings')
    .select('*')
    .eq('status', 'published')
    .eq('sector', job.sector)
    .neq('id', job.id)
    .neq('company_id', job.company_id)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('tier_rank', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []

  return attachCompanies(data)
}