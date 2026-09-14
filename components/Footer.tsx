import Link from 'next/link'
const MAIN_SITE_URL = process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://jobstate.net'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <p className="footer-brand">Jobstate</p>
          <p className="footer-tagline">
            В JobState не е нужно постоянно да търсиш правилната работа. 
            Кажи ни какво търсиш, разглеждай подходящите обяви и получавай известия, 
            когато се появи възможност, която отговаря на твоите критерии.
          </p>
        </div>

        <div>
          <p className="footer-col-heading">Платформа</p>
          <ul className="footer-links">
            <li><Link href={`${MAIN_SITE_URL}/about`}>За нас</Link></li>
            <li><Link href={`${MAIN_SITE_URL}/how-it-works`}>Как работи</Link></li>
            <li><Link href={`${MAIN_SITE_URL}/blog`}>Блог</Link></li>
            <li><Link href={`${MAIN_SITE_URL}/contact`}>Контакти</Link></li>
          </ul>
        </div>

        <div>
          <p className="footer-col-heading">Правна информация</p>
          <ul className="footer-links">
            <li><Link href={`${MAIN_SITE_URL}/terms`}>Общи условия</Link></li>
            <li><Link href={`${MAIN_SITE_URL}/privacy`}>Политика за поверителност</Link></li>
            <li><Link href={`${MAIN_SITE_URL}/cookies`}>Политика за бисквитки</Link></li>
            <li><Link href={`${MAIN_SITE_URL}/pricing`}>Цени</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Jobstate.net Всички права запазени.
      </div>
    </footer>
  )
}
