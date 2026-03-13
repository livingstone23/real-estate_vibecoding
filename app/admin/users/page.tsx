import { getUsersWithRoles } from '@/app/actions/admin'
import RoleSelector from './RoleSelector'
import Link from 'next/link'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10))
  const { users, total, totalPages, currentPage: safePage } = await getUsersWithRoles(currentPage)

  return (
    <div className="font-display">
      <header className="w-full pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#19322F]">User Directory</h1>
            <p className="text-[#19322F]/60 mt-1 text-sm">Manage user access and roles for your properties.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-[#19322F]/40 group-focus-within:text-[#006655] text-xl">search</span>
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-white text-[#19322F] shadow-[0_4px_20px_-2px_rgba(25,50,47,0.05)] placeholder-[#19322F]/30 focus:ring-2 focus:ring-[#006655] focus:bg-white transition-all text-sm" 
                placeholder="Search by name, email..." 
                type="text" 
              />
            </div>
            <button className="inline-flex items-center justify-center px-4 py-2.5 border border-[#006655] text-sm font-medium rounded-lg text-[#006655] bg-transparent hover:bg-[#006655]/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006655] transition-colors whitespace-nowrap">
              <span className="material-icons text-lg mr-2">add</span>
              Add User
            </button>
          </div>
        </div>
        <div className="mt-8 flex gap-6 border-b border-[#19322F]/10 overflow-x-auto">
          <button className="pb-3 text-sm font-semibold text-[#006655] border-b-2 border-[#006655]">All Users</button>
          <button className="pb-3 text-sm font-medium text-[#19322F]/60 hover:text-[#19322F] transition-colors">Admins</button>
          <button className="pb-3 text-sm font-medium text-[#19322F]/60 hover:text-[#19322F] transition-colors">Agents</button>
        </div>
      </header>

      <main className="w-full pb-12 space-y-4">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-[#19322F]/50 mb-2">
          <div className="col-span-4">User Details</div>
          <div className="col-span-3">Role & Status</div>
          <div className="col-span-3">Performance</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {users.map((user) => {
          const fullName = user.first_name || user.last_name 
            ? `${user.first_name || ''} ${user.last_name || ''}`.trim() 
            : 'No Name Provided'
            
          const isAdmin = user.roles.includes('admin')
          
          return (
            <div key={user.id} className={`user-card group relative rounded-xl p-5 shadow-sm border border-transparent hover:shadow-[0_4px_20px_-2px_rgba(25,50,47,0.05)] flex flex-col md:grid md:grid-cols-12 gap-4 items-center z-10 ${isAdmin ? 'bg-[#D9ECC8]' : 'bg-white border-gray-100 hover:bg-[#EEF6F6]'}`}>
              
              {/* User Details */}
              <div className="col-span-12 md:col-span-4 flex items-center w-full">
                <div className="relative flex-shrink-0">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg border-2 border-white ${isAdmin ? 'bg-[#006655] text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${isAdmin ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                </div>
                <div className="ml-4 overflow-hidden">
                  <div className="text-sm font-bold text-[#19322F] truncate">{fullName}</div>
                  <div className="text-xs text-[#19322F]/70 truncate">{user.email}</div>
                  <div className="mt-1 text-[10px] px-2 py-0.5 inline-block bg-white/50 rounded text-[#19322F]/60">
                    ID: #{user.id.substring(0, 8)}
                  </div>
                  {user.nickname && (
                    <div className="text-[10px] text-blue-600 ml-2 inline-block">
                      @{user.nickname}
                    </div>
                  )}
                </div>
              </div>

              {/* Role & Status */}
              <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${isAdmin ? 'bg-[#006655]/10 text-[#006655]' : 'bg-gray-100 text-gray-600'}`}>
                  {user.roles.length > 0 ? user.roles.join(', ') : 'None'}
                </span>
                <div className="flex items-center text-xs text-[#19322F]/60">
                  <span className={`material-icons text-[14px] mr-1 ${isAdmin ? 'text-[#006655]' : 'text-gray-400'}`}>
                    {isAdmin ? 'check_circle' : 'schedule'}
                  </span>
                  {isAdmin ? 'Active' : 'Offline'}
                </div>
              </div>

              {/* Performance / Joined Date */}
              <div className="col-span-12 md:col-span-3 w-full grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#19322F]/50">Joined</div>
                  <div className="text-sm font-semibold text-[#19322F]">
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#19322F]/50">Managed</div>
                  <div className="text-sm font-semibold text-[#19322F]">-</div>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-12 md:col-span-2 w-full flex justify-end relative">
                <RoleSelector 
                  userId={user.id} 
                  currentRoles={user.roles} 
                  availableRoles={user.availableRoles} 
                />
              </div>

            </div>
          )
        })}

        {users.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-sm text-gray-500 border border-gray-100">
            No users found.
          </div>
        )}

      </main>
      
      {/* Pagination Footer */}
      <footer className="mt-auto border-t border-[#19322F]/5 py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#19322F]/60">
              Showing <span className="font-medium text-[#19322F]">{((safePage - 1) * 10) + 1}</span> to <span className="font-medium text-[#19322F]">{Math.min(safePage * 10, total)}</span> of <span className="font-medium text-[#19322F]">{total}</span> users
            </p>
          </div>
          <nav className="relative z-0 inline-flex rounded-md -space-x-px">
            {safePage > 1 ? (
              <Link
                href={`/admin/users?page=${safePage - 1}`}
                className="inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium text-[#19322F]/50 hover:text-[#006655] transition-colors"
              >
                <span className="material-icons text-xl">chevron_left</span>
              </Link>
            ) : (
              <span className="inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium text-[#19322F]/20">
                <span className="material-icons text-xl">chevron_left</span>
              </span>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Link
                key={pageNum}
                href={`/admin/users?page=${pageNum}`}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md mx-0.5 transition-colors ${
                  pageNum === safePage
                    ? 'bg-[#006655] text-white shadow-sm'
                    : 'bg-transparent text-[#19322F]/70 hover:bg-white hover:text-[#006655]'
                }`}
              >
                {pageNum}
              </Link>
            ))}

            {safePage < totalPages ? (
              <Link
                href={`/admin/users?page=${safePage + 1}`}
                className="inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium text-[#19322F]/50 hover:text-[#006655] transition-colors"
              >
                <span className="material-icons text-xl">chevron_right</span>
              </Link>
            ) : (
              <span className="inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium text-[#19322F]/20">
                <span className="material-icons text-xl">chevron_right</span>
              </span>
            )}
          </nav>
        </div>
      </footer>
    </div>
  )
}
