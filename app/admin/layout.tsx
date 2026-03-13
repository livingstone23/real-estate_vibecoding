import { createClient } from '@/utils/supabase/server'
import AdminNavbar from './AdminNavbar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const avatarUrl = user?.user_metadata?.avatar_url || null

  return (
    <div className="min-h-screen bg-[#EEF6F6] font-display text-[#19322F] flex flex-col antialiased">
      <AdminNavbar avatarUrl={avatarUrl} />

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  )
}
