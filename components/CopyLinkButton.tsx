'use client'

import { useState } from 'react'

function CopyLinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Клипбордът може да е недостъпен (стар браузър, липса на разрешение) —
      // тихо не правим нищо, бутонът просто не показва "копирано".
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="job-share-icon-btn"
      aria-label="Копирай линка"
      title={copied ? 'Копирано!' : 'Копирай линка'}
    >
      {copied ? <CheckIcon /> : <CopyLinkIcon />}
    </button>
  )
}