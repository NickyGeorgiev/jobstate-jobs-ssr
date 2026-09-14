import { getPublishedJobs } from '@/lib/jobs'
import { JobCard } from '@/components/JobCard'

export const revalidate = 60

export default async function HomePage() {
  const jobs = await getPublishedJobs()

  return (
    <main className="job-list-shell">
      <header className="mb-10">
        <h1 className="jobs-title text-3xl font-bold">Обяви за работа — Jobstate</h1>
        <p className="text-muted mt-2 text-center">
          Актуални позиции от фирми, които търсят служители чрез Jobstate.
        </p>
      </header>

      {jobs.length === 0 && (
        <p className="text-muted">В момента няма публикувани обяви.</p>
      )}

      <ul className="space-y-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </ul>
    </main>
  )
}
