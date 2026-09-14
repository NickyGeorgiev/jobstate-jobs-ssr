import Link from 'next/link'
import { buildJobUrl, type JobListing, type CompanyInfo } from '@/lib/jobs'
import { log } from 'next/dist/server/typescript/utils';

function TierBadge({ tier }: { tier: JobListing['tier'] }) {
  if (tier === 'free') return null
  return (
    <span className={`tier-badge tier-badge--${tier}`}>
      {tier === 'silver' && '✦ Silver'}
      {tier === 'gold' && '✦ Gold'}
      {tier === 'platinum' && '❖ Platinum'}
      {tier === 'diamond' && '💎 Diamond'}
    </span>
  )
}

function formatRelativeDate(dateString: string | null) {
  if (!dateString) return ''
  const diffMs = Date.now() - new Date(dateString).getTime()
  const hours = Math.floor(diffMs / (1000 * 60 * 60))

  if (hours < 1) return 'преди по-малко от час'
  if (hours < 24) return `преди ${hours} ${hours === 1 ? 'час' : 'часа'}`

  const days = Math.floor(hours / 24)
  if (days < 7) return `преди ${days} ${days === 1 ? 'ден' : 'дни'}`

  return new Date(dateString).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long' })
}

type JobCardProps = {
  job: JobListing & { company?: CompanyInfo | null }
  variant?: 'list' | 'compact'
}

export function JobCard({ job, variant = 'list' }: JobCardProps) {
  if (variant === 'compact') {
    
    return (
      <a
        href={buildJobUrl(job)}
        className={`company-sidebar-job ${job.tier !== 'free' ? `company-sidebar-job--${job.tier}` : ''}`}
      >
        <div className="company-sidebar-job-title">
          <strong>{job.title}</strong>
          <TierBadge tier={job.tier} />
        </div>
        <span className="company-sidebar-job-city">
          🚩 {job.city || 'България'}
          {job.salary_visible && job.salary ? (
            <span>
              {job.salary_max && job.salary_max !== job.salary
                ? ` ${job.salary} - ${job.salary_max} € нето`
                : ` ${job.salary} € нето`}
            </span>
          ) : (
            <span />
          )}
        </span>
      </a>
    )
  }

  return (
    <li>
      <Link href={buildJobUrl(job)} className={`job-card ${job.tier !== 'free' ? `job-card--${job.tier}` : ''}`}>
        <div className="job-card-header-row">
          {job.company?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={job.company.logo_url} alt={job.company.company_name} className="job-card-logo-small" />
          ) : (
            <div className="job-card-logo-placeholder-small">
              {job.company?.company_name ? job.company.company_name[0].toUpperCase() : '🏢'}
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="job-card-top-row">
              <span className="job-card-title-text">{job.title}</span>
              <TierBadge tier={job.tier} />
            </div>

            <p className="job-card-company-line">
              {job.company?.company_name || 'Фирма'}
              {job.published_at ? ` 📆 ${formatRelativeDate(job.published_at)}` : ''}
            </p>
          </div>
        </div>

        <hr className="job-card-divider" />

        {job.description && <p className="job-card-description">{job.description}</p>}

        <div className="job-card-bottom-row">
          <div className="job-card-tags">
            {job.city && <span className="job-tag">🚩 {job.city}</span>}
            {job.sector && <span className="job-tag">💼 {job.sector}</span>}
            {job.duration && <span className="job-tag">🕘 {job.duration}</span>}
          </div>

          {job.salary_visible && job.salary ? (
            <span className="job-tag job-tag--salary">
              {job.salary_max && job.salary_max !== job.salary
                ? `${job.salary} - ${job.salary_max} € нето/месец`
                : `${job.salary} € нето/месец`}
            </span>
          ) : (
            <span />
          )}
        </div>
      </Link>
    </li>
  )
}
