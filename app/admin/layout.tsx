'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#EEF6F6] font-display text-[#19322F] flex flex-col antialiased">
      {/* Top Navbar */}
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
                <div className="h-9 w-9 rounded-full bg-[#19322F]/10 flex items-center justify-center overflow-hidden ring-2 ring-white cursor-pointer border border-[#19322F]/10">
                  <span className="material-icons text-[#19322F]/60 text-lg">person</span>
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

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  )
}

