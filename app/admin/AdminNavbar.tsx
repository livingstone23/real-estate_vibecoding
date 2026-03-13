'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

const navLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
]

export default function AdminNavbar({
  avatarUrl,
}: {
  avatarUrl?: string | null
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await fetch('/auth/signout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#006655]/10 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Primary Nav */}
          <div className="flex">
            <Link href="/admin" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded bg-[#006655] flex items-center justify-center text-white font-bold text-lg">H</div>
              <span className="font-bold text-xl tracking-tight text-[#19322F]">Haven</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) => {
                const isActive = 
                  link.href === '/admin' 
                    ? pathname === '/admin'
                    : pathname.startsWith(link.href)

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-[#006655] text-[#19322F]'
                        : 'border-transparent text-gray-500 hover:text-[#006655] hover:border-[#006655]/30'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Secondary Nav / Profile */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-gray-400 hover:text-[#006655] hover:bg-[#006655]/5 transition-colors relative">
              <span className="material-icons text-xl">notifications_none</span>
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <Link
                href="/"
                className="text-xs text-[#006655] hover:underline hidden sm:inline-flex items-center gap-1"
              >
                <span className="material-icons text-sm">arrow_back</span>
                Back to Site
              </Link>

              {/* Profile Avatar + Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="h-9 w-9 rounded-full bg-[#19322F]/10 flex items-center justify-center overflow-hidden ring-2 ring-white cursor-pointer border border-[#19322F]/10 transition-all hover:ring-[#006655]/30"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="material-icons text-[#19322F]/60 text-lg">person</span>
                  )}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] bg-white ring-1 ring-black/5 overflow-hidden z-50 origin-top-right">
                    <div className="py-1">
                      <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#19322F]/70 hover:bg-[#EEF6F6] hover:text-[#006655] transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <span className="material-icons text-lg">home</span>
                        Back to Site
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span className="material-icons text-lg">logout</span>
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden border-t border-gray-100 px-4 py-2 flex gap-4 overflow-x-auto bg-white">
        {navLinks.map((link) => {
          const isActive = 
            link.href === '/admin' 
              ? pathname === '/admin'
              : pathname.startsWith(link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium whitespace-nowrap pb-1 ${
                isActive
                  ? 'text-[#006655] border-b-2 border-[#006655]'
                  : 'text-gray-500 hover:text-[#006655]'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

