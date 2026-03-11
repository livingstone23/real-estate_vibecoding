import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          <Link
            href="/admin/properties"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
          >
            Properties
          </Link>
          <Link
            href="/admin/users"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
          >
            Users & Roles
          </Link>
          <Link
            href="/"
            className="block mt-8 px-4 py-2 text-sm text-blue-600 hover:underline"
          >
            &larr; Back to Main Site
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
