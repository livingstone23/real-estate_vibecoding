import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { supabase } from '../../../lib/supabase';
import { notFound } from 'next/navigation';
import { mapRow } from '../../../lib/mapper';
import { Navbar } from '../../components/Navbar';
import ClientMap from '../../components/ClientMap';

interface Props {
    params: Promise<{ id_seo: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id_seo } = await params;
    const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('id_seo', id_seo)
        .single();

    if (!data) return { title: 'Not Found' };

    const property = mapRow(data);

    return {
        title: `${property.title} - LuxeEstate`,
        description: `View details for ${property.address} - $${property.price.toLocaleString()}`,
        openGraph: {
            title: `${property.title} - LuxeEstate`,
            description: `View details for ${property.address} - $${property.price.toLocaleString()}`,
            images: [property.images[0]],
        }
    };
}

export async function generateStaticParams() {
    const { data } = await supabase.from('properties').select('id_seo');
    return (data || []).map((row) => ({
        id_seo: row.id_seo,
    }));
}

export const revalidate = 60; // ISR -> revalidate every minute

export default async function PropertyPage({ params }: Props) {
    const { id_seo } = await params;

    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id_seo', id_seo)
        .single();

    if (error || !data) {
        notFound();
    }

    const property = mapRow(data);
    const mainImage = property.images[0];
    const otherImages = property.images.slice(1, 5); // take up to 4 other images

    return (
        <>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                    {/* Left Column - Images */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-sm group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                alt={property.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                src={mainImage}
                            // priority={true} if using next/image, but best practices HTML mock uses standard img
                            />
                            <div className="absolute top-4 left-4 flex gap-2">
                                {property.featured && (
                                    <span className="bg-mosque text-white text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">Premium</span>
                                )}
                                <span className="bg-white/90 backdrop-blur text-nordic text-xs font-medium px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                    {property.status}
                                </span>
                            </div>
                            <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-nordic px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur transition-all flex items-center gap-2">
                                <span className="material-icons text-sm">grid_view</span>
                                View All Photos
                            </button>
                        </div>

                        {/* Thumbnail Gallery (Swipeable) */}
                        {otherImages.length > 0 && (
                            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x">
                                {otherImages.map((img: string, idx: number) => (
                                    <div key={idx} className="flex-none w-48 aspect-[4/3] rounded-lg overflow-hidden cursor-pointer opacity-70 hover:opacity-100 transition-opacity ring-offset-clear-day snap-start">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img alt={`Gallery ${idx}`} className="w-full h-full object-cover" src={img} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Overview & Contact */}
                    <div className="lg:col-span-4 relative">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-mosque/5">
                                <div className="mb-4">
                                    <h1 className="text-4xl font-display font-light text-nordic mb-2">${property.price.toLocaleString()}{property.pricePerMonth ? '/mo' : ''}</h1>
                                    <p className="text-nordic/60 font-medium flex items-center gap-1">
                                        <span className="material-icons text-mosque text-sm">location_on</span>
                                        {property.address}
                                    </p>
                                </div>
                                <div className="h-px bg-slate-100 my-6"></div>
                                <div className="flex items-center gap-4 mb-6">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img alt="Sarah Jenkins" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w" />
                                    <div>
                                        <h3 className="font-semibold text-nordic">Sarah Jenkins</h3>
                                        <div className="flex items-center gap-1 text-xs text-mosque font-medium">
                                            <span className="material-icons text-[14px]">star</span>
                                            <span>Top Rated Agent</span>
                                        </div>
                                    </div>
                                    <div className="ml-auto flex gap-2">
                                        <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
                                            <span className="material-icons text-sm">chat</span>
                                        </button>
                                        <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors">
                                            <span className="material-icons text-sm">call</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <button className="w-full bg-mosque hover:bg-primary-hover text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group">
                                        <span className="material-icons text-xl group-hover:scale-110 transition-transform">calendar_today</span>
                                        Schedule Visit
                                    </button>
                                    <button className="w-full bg-transparent border border-nordic/10 hover:border-mosque text-nordic/80 hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                                        <span className="material-icons text-xl">mail_outline</span>
                                        Contact Agent
                                    </button>
                                </div>
                            </div>

                            {/* Map Card Component */}
                            <div className="bg-white p-2 rounded-xl shadow-sm border border-mosque/5">
                                <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
                                    <ClientMap address={property.address} />
                                    <a className="absolute bottom-2 right-2 bg-white/90 text-xs font-medium px-2 py-1 rounded shadow-sm text-nordic hover:text-mosque z-[1000]" href="#">View on Map</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Left Column Bottom - Details */}
                    <div className="lg:col-span-8 lg:row-start-2 lg:-mt-8 space-y-8">
                        {/* Features */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
                            <h2 className="text-lg font-semibold mb-6 text-nordic dark:text-nordic">Property Features</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                                    <span className="material-icons text-mosque text-2xl mb-2">square_foot</span>
                                    <span className="text-xl font-bold text-nordic dark:text-nordic">{property.area}</span>
                                    <span className="text-xs uppercase tracking-wider text-nordic/50 dark:text-nordic/50">Square Meters</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                                    <span className="material-icons text-mosque text-2xl mb-2">bed</span>
                                    <span className="text-xl font-bold text-nordic dark:text-nordic">{property.beds}</span>
                                    <span className="text-xs uppercase tracking-wider text-nordic/50 dark:text-nordic/50">Bedrooms</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                                    <span className="material-icons text-mosque text-2xl mb-2">shower</span>
                                    <span className="text-xl font-bold text-nordic dark:text-nordic">{property.baths}</span>
                                    <span className="text-xs uppercase tracking-wider text-nordic/50 dark:text-nordic/50">Bathrooms</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                                    <span className="material-icons text-mosque text-2xl mb-2">directions_car</span>
                                    <span className="text-xl font-bold text-nordic dark:text-nordic">2</span>
                                    <span className="text-xs uppercase tracking-wider text-nordic/50 dark:text-nordic/50">Garage</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
                            <h2 className="text-lg font-semibold mb-4 text-nordic dark:text-nordic">About this home</h2>
                            <div className="prose prose-slate max-w-none text-nordic/70 dark:text-nordic/70 leading-relaxed">
                                <p className="mb-4">
                                    {property.title} Experience modern luxury in this architecturally stunning home located in the heart of the city. Designed with an emphasis on indoor-outdoor living, the residence features floor-to-ceiling glass walls that flood the interiors with natural light.
                                </p>
                                <p>
                                    The open-concept kitchen is equipped with top-of-the-line appliances and custom cabinetry, perfect for culinary enthusiasts. Retreat to the primary suite, a sanctuary of relaxation with a spa-inspired bath and private balcony.
                                </p>
                            </div>
                            <button className="mt-4 text-mosque font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                Read more
                                <span className="material-icons text-sm">arrow_forward</span>
                            </button>
                        </div>

                        {/* Amenities */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
                            <h2 className="text-lg font-semibold mb-6 text-nordic dark:text-nordic">Amenities</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                <div className="flex items-center gap-3 text-nordic/70 dark:text-nordic/70">
                                    <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                                    <span>Smart Home System</span>
                                </div>
                                <div className="flex items-center gap-3 text-nordic/70 dark:text-nordic/70">
                                    <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                                    <span>Swimming Pool</span>
                                </div>
                                <div className="flex items-center gap-3 text-nordic/70 dark:text-nordic/70">
                                    <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                                    <span>Central Heating & Cooling</span>
                                </div>
                                <div className="flex items-center gap-3 text-nordic/70 dark:text-nordic/70">
                                    <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                                    <span>Electric Vehicle Charging</span>
                                </div>
                                <div className="flex items-center gap-3 text-nordic/70 dark:text-nordic/70">
                                    <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                                    <span>Private Gym</span>
                                </div>
                                <div className="flex items-center gap-3 text-nordic/70 dark:text-nordic/70">
                                    <span className="material-icons text-mosque/60 text-sm">check_circle</span>
                                    <span>Wine Cellar</span>
                                </div>
                            </div>
                        </div>

                        {/* Estimated Payment */}
                        <div className="bg-mosque/5 p-6 rounded-xl border border-mosque/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-full text-mosque shadow-sm">
                                    <span className="material-icons">calculate</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-nordic dark:text-nordic">Estimated Payment</h3>
                                    <p className="text-sm text-nordic/60 dark:text-nordic/60">Starting from <strong className="text-mosque">${Math.floor(property.price / 250).toLocaleString()}/mo</strong> with 20% down</p>
                                </div>
                            </div>
                            <button className="whitespace-nowrap px-4 py-2 bg-white border border-nordic/10 rounded-lg text-sm font-semibold hover:border-mosque transition-colors text-nordic dark:text-nordic">
                                Calculate Mortgage
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
