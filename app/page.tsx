import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PropertyCard } from './components/PropertyCard';
import { Pagination } from './components/Pagination';
import { getFeaturedProperties, getNewInMarketProperties, PAGE_SIZE } from '../lib/properties';

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? '1', 10));

  const [featuredProperties, { data: newProperties, count }] = await Promise.all([
    getFeaturedProperties(),
    getNewInMarketProperties(currentPage),
  ]);

  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <HeroSection />

        {/* Featured Collections Section */}
        <section className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark dark:text-white">Featured Collections</h2>
              <p className="text-nordic-muted mt-1 text-sm">Curated properties for the discerning eye.</p>
            </div>
            <a href="#" className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity">
              View all <span className="material-icons text-sm">arrow_forward</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} isFeatured={true} />
            ))}
          </div>
        </section>

        {/* New in Market Section */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark dark:text-white">New in Market</h2>
              <p className="text-nordic-muted mt-1 text-sm">
                Fresh opportunities added this week.{' '}
                <span className="text-mosque font-medium">{count} properties</span>
              </p>
            </div>

            <div className="hidden md:flex bg-white dark:bg-white/5 p-1 rounded-lg">
              <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic-dark text-white shadow-sm">All</button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark dark:hover:text-white">Buy</button>
              <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic-dark dark:hover:text-white">Rent</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </section>
      </main>
    </>
  );
}
