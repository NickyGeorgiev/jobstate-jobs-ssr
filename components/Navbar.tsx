'use client'

import Link from 'next/link'

const MAIN_SITE_URL = process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://jobstate.net'

export function Navbar() {
  function handleDashboardClick(e: React.MouseEvent) {
    e.preventDefault()

    window.close()

    setTimeout(() => {
      window.location.href = MAIN_SITE_URL
    }, 150)
  }

  return (
    <nav className="navbar">
      <Link href={MAIN_SITE_URL}>
        <img
          src="/logo-dark.svg"
          alt="Jobstate"
          className="navbar-logo-img logo-dark"
        />

        <img
          src="/logo-light.svg"
          alt="Jobstate"
          className="navbar-logo-img logo-light"
        />

      </Link>

      <div className="navbar-right">
        <div className="navbar-links">
          <Link href={`${MAIN_SITE_URL}/blog`} className="nav-link">
            Блог
          </Link>
          <Link href={`${MAIN_SITE_URL}/how-it-works`} className="nav-link">
            Как работи?
          </Link>
        </div>

        <Link href={MAIN_SITE_URL} onClick={handleDashboardClick} className="btn-primary btn-primary--small">
          Затвори
        </Link>
      </div>
    </nav>
  )
}

