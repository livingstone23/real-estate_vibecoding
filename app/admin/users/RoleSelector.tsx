'use client'

import { useTransition, useState, useRef, useEffect } from 'react'
import { toggleUserRole } from '@/app/actions/admin'

type Role = {
  id: string
  name: string
}

export default function RoleSelector({
  userId,
  currentRoles,
  availableRoles,
}: {
  userId: string
  currentRoles: string[]
  availableRoles: Role[]
}) {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = (roleName: string, checked: boolean) => {
    startTransition(async () => {
      await toggleUserRole(userId, roleName, checked)
    })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-[#19322F]/10 bg-white shadow-sm text-xs font-medium rounded-lg text-[#19322F] hover:bg-[#19322F] hover:text-white focus:outline-none transition-colors w-full md:w-auto justify-center"
      >
        Change Role
        <span className="material-icons text-[16px] ml-2">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-20 origin-top-right">
          <div className={`p-2 space-y-1 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
            {availableRoles.map((role) => {
              const hasRole = currentRoles.includes(role.name)
              return (
                <label key={role.id} className="flex items-center px-3 py-2 text-sm text-[#19322F]/70 hover:bg-[#EEF6F6] hover:text-[#006655] transition-colors rounded-md cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasRole}
                    onChange={(e) => handleToggle(role.name, e.target.checked)}
                    className="mr-3 h-4 w-4 rounded border-gray-300 text-[#006655] focus:ring-[#006655]"
                  />
                  <span className="capitalize">{role.name}</span>
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
