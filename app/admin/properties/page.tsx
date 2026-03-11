import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function AdminPropertiesPage() {
    const supabase = await createClient()

    // Fetch properties
    const { data: properties, error } = await supabase
        .from('properties')
        .select('*')
        .order('id', { ascending: true })

    if (error) {
        console.error("Error loading properties:", error)
        return <div>Error loading properties.</div>
    }

    return (
        <div className="font-display text-[#19322F]">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
                    <p className="text-gray-500 mt-1">Manage your portfolio and track performance.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white border md:border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2">
                        <span className="material-icons text-base">filter_list</span> Filter
                    </button>
                    <button className="bg-[#006655] hover:bg-[#006655]/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-[#006655]/20 shadow-md transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2">
                        <span className="material-icons text-base">add</span> Add New Property
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Listings</p>
                        <p className="text-2xl font-bold mt-1">{properties?.length || 0}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-[#006655]/10 flex items-center justify-center text-[#006655]">
                        <span className="material-icons">apartment</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active Properties</p>
                        <p className="text-2xl font-bold mt-1">
                            {properties?.filter(p => !p.price_per_month).length || 0}
                        </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-[#D9ECC8] flex items-center justify-center text-[#006655]">
                        <span className="material-icons">check_circle</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-[#006655]/10 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Featured</p>
                        <p className="text-2xl font-bold mt-1">
                            {properties?.filter(p => p.featured).length || 0}
                        </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <span className="material-icons">star</span>
                    </div>
                </div>
            </div>

            {/* Property List Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-6">Property Details</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* List Items */}
                {properties?.map((property) => (
                    <div key={property.id} className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 hover:bg-[#EEF6F6] transition-colors items-center">
                        <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                            <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                                <img 
                                    src={property.images && property.images.length > 0 ? property.images[0] : 'https://placehold.co/400x300?text=No+Image'} 
                                    alt={property.image_alt || property.title} 
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold group-hover:text-[#006655] transition-colors cursor-pointer">{property.title}</h3>
                                <p className="text-sm text-gray-500">{property.address || property.location}</p>
                                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                                    <span className="flex items-center gap-1"><span className="material-icons text-[14px]">bed</span> {property.beds || 0} Beds</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span className="flex items-center gap-1"><span className="material-icons text-[14px]">bathtub</span> {property.baths || 0} Baths</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span>{property.area || 0} sqft</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-6 md:col-span-2">
                            <div className="text-base font-semibold text-[#19322F]">${property.price?.toLocaleString()}</div>
                            {property.price_per_month && (
                                <div className="text-xs text-gray-400">Monthly</div>
                            )}
                        </div>
                        <div className="col-span-6 md:col-span-2">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                property.featured 
                                    ? 'bg-[#D9ECC8] text-[#006655] border border-[#006655]/10' 
                                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${property.featured ? 'bg-[#006655]' : 'bg-gray-500'}`}></span>
                                {property.status || (property.featured ? 'Featured' : 'Standard')}
                            </span>
                        </div>
                        <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
                            <button className="p-2 rounded-lg text-gray-400 hover:text-[#006655] hover:bg-[#D9ECC8]/30 transition-all tooltip-trigger" title="Edit Property">
                                <span className="material-icons text-xl">edit</span>
                            </button>
                            <button className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all tooltip-trigger" title="Delete Property">
                                <span className="material-icons text-xl">delete_outline</span>
                            </button>
                        </div>
                    </div>
                ))}
                
                {properties?.length === 0 && (
                    <div className="px-6 py-8 text-center text-gray-500">
                        No properties found. Add your first property to get started.
                    </div>
                )}

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50/50">
                    <div className="text-sm text-gray-500">
                        Showing <span className="font-medium text-[#19322F]">1</span> to <span className="font-medium text-[#19322F]">
                            {Math.min(properties?.length || 0, 10)}
                        </span> of <span className="font-medium text-[#19322F]">{properties?.length || 0}</span> results
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-white disabled:opacity-50">Previous</button>
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-white">Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
