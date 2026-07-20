'use client'

import { useRouter } from 'next/navigation'

export type Page = 'landing' | 'search' | 'detail' | 'booking' | 'dashboard'

const ROUTES: Record<Page, (tripId?: number) => string> = {
  landing: () => '/',
  search: () => '/search',
  detail: (tripId) => `/trip/${tripId ?? 1}`,
  booking: (tripId) => `/booking/${tripId ?? 1}`,
  dashboard: () => '/dashboard',
}

/**
 * Preserves the original app's `onNavigate(page, tripId)` calling convention
 * used throughout every page/component, but backs it with real App Router
 * navigation (actual URLs, browser history, shareable links) instead of
 * in-memory useState page switching.
 */
export function useAppNavigate() {
  const router = useRouter()

  return (page: Page, tripId?: number) => {
    router.push(ROUTES[page](tripId))
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
