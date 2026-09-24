import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import {
  extractIdFromSlugParam,
  getJobByIdAnyStatus,
  isJobActive,
  getCompanyJobs,
  getRelatedJobs,
} from '@/lib/jobs'
import { ViewCounter } from '@/components/ViewCounter'
import { JobCard } from '@/components/JobCard'
import { CopyLinkButton } from '@/components/CopyLinkButton'


function ViberIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.696 6.7.63 9.817c-.066 3.117-.144 8.964 5.5 10.542h.005l-.004 2.416s-.037.977.61 1.177c.78.243 1.238-.5 1.983-1.302.408-.44.972-1.084 1.397-1.578 3.85.324 6.81-.415 7.15-.525.78-.253 5.19-.816 5.906-6.663.74-6.03-.36-9.83-2.347-11.564l-.006-.001c-.6-.556-3.01-2.32-8.36-2.343 0 0-.342-.02-.856-.024L11.4 0zm.098 1.594c.428.001.694.02.694.02 4.522.019 6.685 1.427 7.198 1.893 1.674 1.454 2.533 4.837 1.91 9.877-.61 4.917-4.17 5.24-4.83 5.45-.283.09-2.888.734-6.157.522 0 0-2.44 2.943-3.2 3.706-.12.12-.26.168-.353.145-.13-.033-.166-.19-.164-.417l.02-4.02c-4.774-1.325-4.492-6.365-4.436-8.99.056-2.626.55-4.74 1.988-6.175 1.99-1.814 5.66-2.008 7.33-2.011zm-.014 2.04c-.31 0-.56.25-.56.56 0 .31.25.56.56.56 2.098 0 3.804 1.706 3.804 3.804 0 .31.25.56.56.56.31 0 .56-.25.56-.56 0-2.717-2.207-4.924-4.924-4.924zm-3.033.68c-.168-.004-.34.037-.494.13-.474.278-.887.63-1.216 1.052-.24.31-.36.7-.334 1.09.04.633.24 1.446.71 2.66.475 1.216 1.216 2.366 2.12 3.27.9.9 2.04 1.635 3.246 2.11 1.203.475 2.01.68 2.65.71.39.02.78-.1 1.09-.334.42-.33.774-.744 1.05-1.216.16-.27.19-.6.08-.9-.11-.29-.32-.53-.6-.68l-1.63-.84c-.28-.14-.6-.15-.89-.03-.15.06-.29.15-.4.27l-.44.44c-.1.1-.24.14-.37.11-.43-.1-1.33-.4-2.22-1.29-.9-.9-1.19-1.79-1.29-2.22-.03-.13.01-.27.11-.37l.44-.44c.12-.11.21-.25.27-.4.12-.29.11-.61-.03-.89l-.84-1.63c-.15-.28-.39-.49-.68-.6a.98.98 0 0 0-.28-.06z" />
    </svg>
  )
}

function WhatsappIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.5 14.4c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.2-.7.9-.8 1-.1.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.4-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1.1 2.6c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.1.2-1.3-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.4 2 11.8c0 1.9.5 3.7 1.5 5.3L2 22l5-1.4c1.5.8 3.2 1.2 5 1.2 5.5 0 10-4.4 10-9.9C22 6.4 17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3c-.9-1.4-1.4-3-1.4-4.6 0-4.5 3.7-8.2 8.5-8.2s8.5 3.7 8.5 8.2S16.8 20 12 20z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export const revalidate = 60

// Празен списък: страниците не се генерират при build, а при първа заявка,
// и после се кешират за `revalidate` секунди (ISR).
export async function generateStaticParams() {
  return []
}

const MAIN_SITE_URL = process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://jobstate.net'

function isSafeExternalUrl(url: string | null): boolean {
  if (!url) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function toEmploymentType(duration: string | null): string | undefined {
  if (!duration) return undefined
  if (duration.includes('непълен работен ден')) return 'PART_TIME'
  if (duration.includes('пълен работен ден')) return 'FULL_TIME'
  if (duration.includes('Стажант')) return 'INTERN'
  if (duration.includes('Freelancer')) return 'CONTRACTOR'
  return 'OTHER'
}

type PageProps = {
  params: Promise<{ slug: string }>
}

async function loadJobState(slugParam: string) {
  const id = extractIdFromSlugParam(slugParam)
  if (!id) return { state: 'not_found' as const }

  const job = await getJobByIdAnyStatus(id)
  if (!job) return { state: 'not_found' as const }

  if (isJobActive(job)) return { state: 'active' as const, job }

  return { state: 'closed' as const, job }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const result = await loadJobState(slug)

  if (result.state === 'not_found') {
    return { title: 'Обявата не е намерена — Jobstate' }
  }

  if (result.state === 'closed') {
    return {
      title: `Тази обява вече не е активна — Jobstate`,
      robots: { index: false, follow: true },
    }
  }

  const job = result.job

  const title = `${job.title}${job.company?.company_name
    ? ` — ${job.company.company_name}`
    : ''
    } | Jobstate`

  const description = job.description.slice(0, 160)
  const canonicalPath = `/jobs/${job.slug || 'obiava'}-${job.id}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalPath,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params
  const result = await loadJobState(slug)

  if (result.state === 'not_found') {
    notFound()
  }

  if (result.state === 'closed') {
    const closedJob = result.job
    const otherJobs = closedJob.company_id
      ? await getCompanyJobs(closedJob.company_id)
      : []

    return (
      <main className="job-detail-page">
        <a href={`${MAIN_SITE_URL}/jobs`} className="text-sm text-muted hover:underline job-back-link">
          ← Всички обяви
        </a>

        <section className="job-detail-main mt-6">
          <h1 className="jobs-title text-3xl font-bold">Тази обява вече не е активна</h1>
          <p className="text-muted mt-4 text-center">
            {closedJob.company?.company_name
              ? `Позицията "${closedJob.title}" при ${closedJob.company.company_name} вече не приема кандидатури.`
              : `Позицията "${closedJob.title}" вече не приема кандидатури.`}
          </p>

          {otherJobs.length > 0 && (
            <div className="mt-10 max-w-2xl mx-auto">
              <h2 className="jobs-title text-xl font-semibold mb-4">
                Други активни обяви от {closedJob.company?.company_name || 'тази фирма'}
              </h2>

              <ul className="space-y-4">
                {otherJobs.map((j) => (
                  <JobCard key={j.id} job={j} />
                ))}
              </ul>
            </div>
          )}

          <div className="text-center mt-10">
            <a
              href={`${MAIN_SITE_URL}/jobs`}
              className="btn-primary"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              Разгледай всички обяви
            </a>
          </div>
        </section>
      </main>
    )
  }

  const job = result.job
  const canonicalPath = `/jobs/${slug}`

  const companyJobs = job.company_id
    ? await getCompanyJobs(job.company_id, job.id)
    : []

  const relatedJobs = await getRelatedJobs(job)

  const company = job.company

  const externalUrl = job.external_url

  const applyHref =
    job.application_mode === 'external' && externalUrl && isSafeExternalUrl(externalUrl)
      ? externalUrl
      : `${MAIN_SITE_URL}/apply/${job.id}`

  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.published_at || job.created_at,

    hiringOrganization: {
      '@type': 'Organization',
      name: company?.company_name || 'Jobstate',
      logo: company?.logo_url || undefined,
    },

    validThrough: job.expires_at || undefined,

    jobLocation: job.city
      ? {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: job.city,
          addressCountry: 'BG',
        },
      }
      : undefined,

    employmentType: toEmploymentType(job.duration),

    identifier: {
      '@type': 'PropertyValue',
      name: 'Jobstate',
      value: job.id,
    },

    directApply: job.application_mode === 'platform',

    ...(job.salary_visible && job.salary
      ? {
        baseSalary: {
          '@type': 'MonetaryAmount',
          currency: 'EUR',
          value:
            job.salary_max && job.salary_max !== job.salary
              ? {
                '@type': 'QuantitativeValue',
                minValue: job.salary,
                maxValue: job.salary_max,
                unitText: 'MONTH',
              }
              : {
                '@type': 'QuantitativeValue',
                value: job.salary,
                unitText: 'MONTH',
              },
        },
      }
      : {}),
  }

  const publishedDate = job.published_at
    ? new Date(job.published_at).toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    : null

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@position': 1,
        '@type': 'ListItem',
        name: 'Начало',
        item: 'https://jobs.jobstate.net',
      },
      {
        '@position': 2,
        '@type': 'ListItem',
        name: job.title,
        item: `https://jobs.jobstate.net${canonicalPath}`,
      },
    ],
  }

  return (
    <main className="job-detail-page">

      <ViewCounter jobId={job.id} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData), }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <a href="/" className="text-sm text-muted hover:underline job-back-link">
        ← Всички обяви
      </a>

      <div className="job-detail-layout">

        <section className="job-detail-main">

          {(() => {
            const banner = job.banner_url || company?.banner_url || null
            const logo = company?.logo_url || null

            if (banner) {
              return (
                <div className="job-detail-banner-wrapper">
                  <Image
                    src={banner}
                    alt={job.title}
                    fill
                    sizes="(max-width: 800px) 100vw, 800px"
                    className="job-detail-banner"
                    priority
                  />
                  {logo && (
                    <Image
                      src={logo}
                      alt={company?.company_name || ''}
                      width={72}
                      height={72}
                      className="job-detail-banner-logo"
                    />
                  )}
                </div>
              )
            }

            if (logo) {
              return (
                <div className="job-detail-logo-only-wrapper">
                  <Image
                    src={logo}
                    alt={company?.company_name || ''}
                    width={88}
                    height={88}
                    className="job-detail-logo-only"
                  />
                </div>
              )
            }

            return null
          })()}

          <h1 className="jobs-title text-3xl font-bold mt-4">
            {job.title}
          </h1>

          <p className="jobs-mono text-muted text-sm mt-2">
            {publishedDate && (
              <>
                Публикувана на {publishedDate}
              </>
            )}

            {publishedDate && ' · '}

            {job.view_count ?? 0} преглеждания
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            {company?.company_name && (
              <span className="job-tag">
                {company?.company_name || 'Фирма'}
              </span>
            )}

            {job.city && (
              <span className="job-tag">
                {job.city ? ` ${job.city}` : ''}
              </span>
            )}

            {job.sector && (
              <span className="job-tag">
                {job.sector ? ` ${job.sector}` : ''}
              </span>
            )}

            {job.level && (
              <span className="job-tag">
                {job.level}
              </span>
            )}

            {job.duration && (
              <span className="job-tag">
                {job.duration}
              </span>
            )}

            {job.salary_visible && job.salary && (
              <span className="job-tag job-tag--salary">
                {job.salary_max && job.salary_max !== job.salary
                  ? `${job.salary} - ${job.salary_max} € / месец`
                  : `${job.salary} € / месец`}
              </span>
            )}
          </div>

          <div className="job-share-row">
            <span className="job-share-label">Сподели:</span>
            
            <a href={`viber://forward?text=${encodeURIComponent(`${job.title} — ${`https://jobs.jobstate.net${canonicalPath}`}`)}`}
              className="job-share-icon-btn"
              aria-label="Сподели във Viber"
              title="Viber"
            >
              <ViberIcon />
            </a>
            
            <a href={`https://wa.me/?text=${encodeURIComponent(`${job.title} — ${`https://jobs.jobstate.net${canonicalPath}`}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="job-share-icon-btn"
              aria-label="Сподели в WhatsApp"
              title="WhatsApp"
            >
              <WhatsappIcon />
            </a>
            
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://jobs.jobstate.net${canonicalPath}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="job-share-icon-btn"
              aria-label="Сподели във Facebook"
              title="Facebook"
            >
              <FacebookIcon />
            </a>
          
            <CopyLinkButton url={`https://jobs.jobstate.net${canonicalPath}`} />

          </div>


          <hr className="job-card-divider" />

          <article className="job-detail-description mt-8 whitespace-pre-wrap leading-relaxed">
            {job.description}
          </article>

          <hr className="job-card-divider" />

          <div className="job-detail-apply">
            <a href={applyHref}
              target={
                job.application_mode === 'external'
                  ? '_blank'
                  : undefined
              }
              rel={
                job.application_mode === 'external'
                  ? 'noopener noreferrer'
                  : undefined
              }
              className="btn-primary"
            >
              Кандидатствай
            </a>
          </div>

        </section>


        {company && (
          <aside className="company-job-sidebar">

            <div className="company-job-card">

              <div className="company-job-header">
                <h2 className="company-job-name">
                  {company.company_name}
                </h2>

                {company.sector && (
                  <p className="company-job-sector">
                    {company.sector}
                  </p>
                )}
              </div>

              {company.bio && (
                <div className="company-job-section">
                  <h3>За фирмата</h3>

                  <p>
                    {company.bio}
                  </p>
                </div>
              )}

              {(company.founded_year ||
                company.employee_count ||
                company.locations_count) && (
                  <div className="company-job-facts">

                    {company.founded_year && (
                      <div>
                        <strong>
                          {company.founded_year}
                        </strong>
                        <span>Основана</span>
                      </div>
                    )}

                    {company.employee_count && (
                      <div>
                        <strong>
                          {company.employee_count}
                        </strong>
                        <span>Служители</span>
                      </div>
                    )}

                    {company.locations_count && (
                      <div>
                        <strong>
                          {company.locations_count}
                        </strong>
                        <span>Обекти</span>
                      </div>
                    )}

                  </div>
                )}

              {company.why_work_here && (
                <div className="company-job-section">
                  <h3>
                    Защо да избереш нас?
                  </h3>

                  <p>
                    {company.why_work_here}
                  </p>
                </div>
              )}

              {company.perks &&
                company.perks.length > 0 && (
                  <div className="company-job-section">
                    <h3>Придобивки</h3>

                    <div className="company-job-tags">
                      {company.perks.map((perk, index) => (
                        <span key={index}>
                          ✓ {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {company.values &&
                company.values.length > 0 && (
                  <div className="company-job-section">
                    <h3>Ценности</h3>

                    <div className="company-job-tags">
                      {company.values.map((value, index) => (
                        <span key={index}>
                          ★ {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {(company.contact_address ||
                company.contact_phone ||
                company.contact_email) && (
                  <div className="company-job-section">
                    <h3>Контакти</h3>

                    <div className="company-job-contacts">

                      {company.contact_address && (
                        <div>
                          📍 {company.contact_address}
                        </div>
                      )}

                      {company.contact_phone && (
                        <a
                          href={`tel:${company.contact_phone}`}
                        >
                          📞 {company.contact_phone}
                        </a>
                      )}

                      {company.contact_email && (
                        <a
                          href={`mailto:${company.contact_email}`}
                        >
                          ✉ {company.contact_email}
                        </a>
                      )}

                    </div>
                  </div>
                )}

              {(company.social_website ||
                company.social_facebook ||
                company.social_linkedin ||
                company.social_instagram) && (
                  <div className="company-job-section">
                    <h3>Онлайн</h3>

                    <div className="company-job-socials">

                      {company.social_website && (
                        <a
                          href={company.social_website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Уебсайт
                        </a>
                      )}

                      {company.social_facebook && (
                        <a
                          href={company.social_facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Facebook
                        </a>
                      )}

                      {company.social_linkedin && (
                        <a
                          href={company.social_linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          LinkedIn
                        </a>
                      )}

                      {company.social_instagram && (
                        <a
                          href={company.social_instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Instagram
                        </a>
                      )}

                    </div>
                  </div>
                )}

              <a href={`${MAIN_SITE_URL}/companies/${company.id}`} className="company-job-profile-link">Виж профила на фирмата →</a>

              {companyJobs.length > 0 && (
                <div className="company-sidebar-section">
                  <h3 className="company-sidebar-heading">
                    Други обяви от компанията
                  </h3>

                  <div className="company-sidebar-jobs">
                    {companyJobs.map((companyJob) => (
                      <JobCard key={companyJob.id} job={companyJob} variant="compact" />
                    ))}
                  </div>
                </div>
              )}

            </div>

          </aside>
        )}

      </div>

      {relatedJobs.length > 0 && (
        <section className="job-list-shell mt-16">
          <h2 className="jobs-title text-xl font-semibold mb-4">Подобни обяви</h2>
          <ul className="space-y-4">
            {relatedJobs.map((rj) => (
              <JobCard key={rj.id} job={rj} />
            ))}
          </ul>
        </section>
      )}

    </main>
  )
}
