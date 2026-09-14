import type { MetadataRoute } from 'next'
import { getPublishedJobs, buildJobUrl, getActiveCities } from '@/lib/jobs'
import { slugify } from '@/lib/slug'

const SITE_URL = 'https://jobs.jobstate.net'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getPublishedJobs()
  const cities = await getActiveCities()

  const jobEntries: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${SITE_URL}${buildJobUrl(job)}`,
    lastModified: job.published_at || job.created_at,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  const cityEntries: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${SITE_URL}/rabota/${slugify(c.city)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    ...cityEntries,
    ...jobEntries,
  ]
}