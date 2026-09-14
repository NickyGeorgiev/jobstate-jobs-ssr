import Link from 'next/link'
import type { Metadata } from 'next'
import { getActiveCities, getJobsByCityName } from '@/lib/jobs'
import { slugify, matchSlug } from '@/lib/slug'
import { JobCard } from '@/components/JobCard'

export const revalidate = 60

type PageProps = {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  const cities = await getActiveCities()
  return cities.map((c) => ({ city: slugify(c.city) }))
}

async function loadCityData(citySlug: string) {
  const cities = await getActiveCities()
  const cityNames = cities.map((c) => c.city)
  const realCityName = matchSlug(citySlug, cityNames)

  if (!realCityName) return null

  const jobs = await getJobsByCityName(realCityName)
  return { cityName: realCityName, jobs }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params
  const data = await loadCityData(city)

  if (!data) {
    return { title: 'Работа в България | Jobstate' }
  }

  const { cityName, jobs } = data
  const count = jobs.length
  const title = `Работа в ${cityName} — ${count} ${count === 1 ? 'обява' : 'обяви'} | Jobstate`
  const description = `Разгледай ${count} актуални ${count === 1 ? 'обява' : 'обяви'} за работа в ${cityName}. Кандидатствай директно през Jobstate.`
  const canonicalPath = `/rabota/${slugify(cityName)}`

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    robots: { index: count > 0, follow: true },
    openGraph: { title, description, type: 'website', url: canonicalPath },
  }
}

export default async function CityJobsPage({ params }: PageProps) {
  const { city } = await params
  const data = await loadCityData(city)

  if (!data) {
    return (
      <main className="job-list-shell">
        <h1 className="jobs-title text-3xl font-bold">Работа в България</h1>
        <p className="text-muted mt-4">
          Все още нямаме обяви за този град. <Link href="/">Разгледай всички обяви</Link>.
        </p>
      </main>
    )
  }

  const { cityName, jobs } = data

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: jobs.map((job, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://jobs.jobstate.net/jobs/${job.slug || 'obiava'}-${job.id}`,
    })),
  }

  return (
    <main className="job-list-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <header className="mb-10">
        <h1 className="jobs-title text-3xl font-bold">Работа в {cityName}</h1>
        <p className="text-muted mt-2">
          {jobs.length} {jobs.length === 1 ? 'активна обява' : 'активни обяви'} в {cityName} в момента.
        </p>
      </header>

      {jobs.length === 0 && (
        <p className="text-muted">
          Все още няма обяви в {cityName}. <Link href="/">Разгледай всички обяви</Link>.
        </p>
      )}

      <ul className="space-y-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </ul>
    </main>
  )
}
