'use client'

import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export function ViewCounter({ jobId }: { jobId: string }) {
  const hasCounted = useRef(false)

  useEffect(() => {
    if (hasCounted.current) return
    hasCounted.current = true
    supabase.rpc('increment_job_view', { job_id: jobId }).then(({ error }) => {
      if (error) console.error('Error incrementing view count:', error)
    })
  }, [jobId])

  return null
}
