'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

export function UserProfileMenu({
  avatarUrl,
  userName,
  isAdmin,
}: {
  avatarUrl: string
  userName: string
  isAdmin: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
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
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque transition-all cursor-pointer"
      >
        <img
          alt={userName || 'Profile'}
          className="w-full h-full object-cover"
          src={avatarUrl}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] bg-white dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-50 origin-top-right">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-nordic-dark dark:text-white truncate">{userName || 'User'}</p>
          </div>

          <div className="py-1">
            {/* Admin Links - only shown to admins */}
            {isAdmin && (
              <>
                <div className="px-4 py-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Admin Panel</p>
                </div>
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-nordic-dark/70 dark:text-gray-300 hover:bg-mosque/5 dark:hover:bg-mosque/10 hover:text-mosque transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <span className="material-icons text-lg">apartment</span>
                  Properties
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-nordic-dark/70 dark:text-gray-300 hover:bg-mosque/5 dark:hover:bg-mosque/10 hover:text-mosque transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <span className="material-icons text-lg">people</span>
                  Users
                </Link>
                <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
              </>
            )}

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <span className="material-icons text-lg">logout</span>
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
