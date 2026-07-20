import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'OpenTrip — Jelajahi Keajaiban Nusantara',
  description:
    'Platform open trip terpercaya untuk destinasi eksotis Indonesia. Bergabung dengan ribuan traveler dari seluruh penjuru nusantara.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen bg-[#F8FAFF]"
        style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
      >
        <Navbar />
        {children}
      </body>
    </html>
  )
}
