'use client'

import { useState } from 'react'
import { Globe, Search, Bell, User, Menu, X, ChevronDown } from 'lucide-react'
import { useAppNavigate, type Page } from '@/hooks/useAppNavigate'

export default function Navbar() {
  const onNavigate = useAppNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <nav
      style={{
        boxShadow: '0 1px 0 0 #E5EEFF, 0 4px 24px 0 rgba(10,31,68,0.06)',
        backdropFilter: 'blur(12px)',
        background: 'rgba(255,255,255,0.96)',
      }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="max-w-[1440px] mx-auto px-8 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1A56DB] flex items-center justify-center shadow-sm">
            <Globe size={16} className="text-white" />
          </div>
          <span className="font-semibold text-[#0A1F44] text-[17px] tracking-tight">
            Open<span className="text-[#1A56DB]">Trip</span>
          </span>
        </button>

        {/* Center nav links */}
        <div className="hidden lg:flex items-center gap-1">
          {[
            { label: 'Explore', page: 'search' as Page },
            { label: 'Destinations', page: 'landing' as Page },
            { label: 'Open Trips', page: 'search' as Page },
            { label: 'Private Tours', page: 'search' as Page },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.page)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#374151] hover:text-[#1A56DB] hover:bg-[#EFF6FF] transition-all duration-150"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('search')}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#6B7280] hover:text-[#1A56DB] hover:bg-[#EFF6FF] transition-all duration-150"
          >
            <Search size={16} />
          </button>
          <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#6B7280] hover:text-[#1A56DB] hover:bg-[#EFF6FF] transition-all duration-150 relative">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0EA5E9] rounded-full border border-white" />
          </button>

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl border border-[#E5EEFF] bg-white hover:border-[#1A56DB] hover:shadow-sm transition-all duration-150"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1A56DB] to-[#0EA5E9] flex items-center justify-center">
                <User size={13} className="text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-[#0A1F44]">Andi</span>
              <ChevronDown size={13} className="text-[#6B7280]" />
            </button>
            {userMenuOpen && (
              <div
                className="absolute right-0 top-12 w-52 bg-white rounded-2xl border border-[#E5EEFF] py-2 z-50"
                style={{ boxShadow: '0 8px 32px rgba(10,31,68,0.12)' }}
              >
                {[
                  { label: 'My Dashboard', page: 'dashboard' as Page },
                  { label: 'My Bookings', page: 'dashboard' as Page },
                  { label: 'Saved Trips', page: 'dashboard' as Page },
                  { label: 'Settings', page: 'dashboard' as Page },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { onNavigate(item.page); setUserMenuOpen(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#374151] hover:bg-[#EFF6FF] hover:text-[#1A56DB] transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="my-1 border-t border-[#E5EEFF]" />
                <button className="w-full text-left px-4 py-2.5 text-sm text-[#EF4444] hover:bg-red-50 transition-colors">
                  Sign Out
                </button>
              </div>
            )}
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-[#EFF6FF] transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-[#E5EEFF] bg-white px-6 py-4 flex flex-col gap-1">
          {(['Explore', 'Destinations', 'Open Trips', 'Private Tours'] as const).map((label) => (
            <button
              key={label}
              onClick={() => { onNavigate('search'); setMenuOpen(false) }}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#374151] hover:bg-[#EFF6FF] hover:text-[#1A56DB] transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
