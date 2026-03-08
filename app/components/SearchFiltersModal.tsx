'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchFiltersModalProps {
    onClose: () => void;
}

export function SearchFiltersModal({ onClose }: SearchFiltersModalProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state for filters, initialized from URL if present
    const [location, setLocation] = useState(searchParams.get('q') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [propertyType, setPropertyType] = useState(searchParams.get('type') || 'Any Type');
    const [beds, setBeds] = useState(parseInt(searchParams.get('beds') || '0', 10));
    const [baths, setBaths] = useState(parseInt(searchParams.get('baths') || '0', 10));

    // Parse amenities from URL
    const initialAmenities = searchParams.get('amenities')?.split(',') || [];
    const [amenities, setAmenities] = useState<string[]>(initialAmenities);

    const toggleAmenity = (amenity: string) => {
        setAmenities(prev =>
            prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
        );
    };

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (location) params.set('q', location); else params.delete('q');
        if (minPrice && minPrice !== '0') params.set('minPrice', minPrice); else params.delete('minPrice');
        if (maxPrice) params.set('maxPrice', maxPrice); else params.delete('maxPrice');
        if (propertyType !== 'Any Type') params.set('type', propertyType); else params.delete('type');
        if (beds > 0) params.set('beds', beds.toString()); else params.delete('beds');
        if (baths > 0) params.set('baths', baths.toString()); else params.delete('baths');
        if (amenities.length > 0) params.set('amenities', amenities.join(',')); else params.delete('amenities');

        // Reset to page 1 on new filter
        params.delete('page');

        router.push(`/?${params.toString()}`);
        onClose();
    };

    const handleClearFilters = () => {
        setLocation('');
        setMinPrice('');
        setMaxPrice('');
        setPropertyType('Any Type');
        setBeds(0);
        setBaths(0);
        setAmenities([]);
    };

    const formatPrice = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const availableAmenities = [
        { id: 'Pool', icon: 'pool', label: 'Swimming Pool' },
        { id: 'Gym', icon: 'fitness_center', label: 'Gym' },
        { id: 'Parking', icon: 'local_parking', label: 'Parking' },
        { id: 'Air Conditioning', icon: 'ac_unit', label: 'Air Conditioning' },
        { id: 'Wifi', icon: 'wifi', label: 'High-speed Wifi' },
        { id: 'Patio / Terrace', icon: 'deck', label: 'Patio / Terrace' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Overlay */}
            <div
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Main Modal Container */}
            <main className="relative z-50 w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <header className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-30">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Filters</h1>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
                    >
                        <span className="material-icons">close</span>
                    </button>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto hide-scroll p-8 space-y-10">

                    {/* Section 1: Location */}
                    <section>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Location</label>
                        <div className="relative group">
                            <span className="material-icons absolute left-4 top-3.5 text-gray-400 group-focus-within:text-mosque transition-colors">location_on</span>
                            <input
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-mosque focus:bg-white dark:focus:bg-gray-800 transition-all shadow-sm"
                                placeholder="City, neighborhood, or address"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </section>

                    {/* Section 2: Price Range */}
                    <section>
                        <div className="flex justify-between items-end mb-4">
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price Range</label>
                            <span className="text-sm font-medium text-mosque">Select Range</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-slate-50 dark:bg-gray-800 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">Min Price</label>
                                <div className="flex items-center">
                                    <span className="text-gray-400 mr-1">$</span>
                                    <input
                                        className="w-full bg-transparent border-0 p-0 text-gray-900 dark:text-white font-medium focus:ring-0 text-sm"
                                        type="text"
                                        value={formatPrice(minPrice)}
                                        onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ''))}
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-gray-800 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">Max Price</label>
                                <div className="flex items-center">
                                    <span className="text-gray-400 mr-1">$</span>
                                    <input
                                        className="w-full bg-transparent border-0 p-0 text-gray-900 dark:text-white font-medium focus:ring-0 text-sm"
                                        type="text"
                                        value={formatPrice(maxPrice)}
                                        onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ''))}
                                        placeholder="No Max"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Property Details */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Property Type */}
                        <div className="space-y-3">
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Property Type</label>
                            <div className="relative">
                                <select
                                    className="w-full bg-slate-50 dark:bg-gray-800 border-0 rounded-lg py-3 pl-4 pr-10 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-mosque cursor-pointer"
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                >
                                    <option value="Any Type">Any Type</option>
                                    <option value="House">House</option>
                                    <option value="Apartment">Apartment</option>
                                    <option value="Condo">Condo</option>
                                    <option value="Townhouse">Townhouse</option>
                                    <option value="Villa">Villa</option>
                                    <option value="Penthouse">Penthouse</option>
                                </select>
                                <span className="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        {/* Rooms */}
                        <div className="space-y-4">
                            {/* Beds */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Bedrooms</span>
                                <div className="flex items-center space-x-3 bg-slate-50 dark:bg-gray-800 rounded-full p-1">
                                    <button
                                        onClick={() => setBeds(Math.max(0, beds - 1))}
                                        className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque transition-colors"
                                    >
                                        <span className="material-icons text-base">remove</span>
                                    </button>
                                    <span className="text-sm font-semibold w-4 text-center">{beds > 0 ? beds + '+' : 'Any'}</span>
                                    <button
                                        onClick={() => setBeds(beds + 1)}
                                        className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                                    >
                                        <span className="material-icons text-base">add</span>
                                    </button>
                                </div>
                            </div>

                            {/* Baths */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Bathrooms</span>
                                <div className="flex items-center space-x-3 bg-slate-50 dark:bg-gray-800 rounded-full p-1">
                                    <button
                                        onClick={() => setBaths(Math.max(0, baths - 1))}
                                        className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque transition-colors"
                                    >
                                        <span className="material-icons text-base">remove</span>
                                    </button>
                                    <span className="text-sm font-semibold w-4 text-center">{baths > 0 ? baths + '+' : 'Any'}</span>
                                    <button
                                        onClick={() => setBaths(baths + 1)}
                                        className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                                    >
                                        <span className="material-icons text-base">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Amenities */}
                    <section>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Amenities & Features</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {availableAmenities.map(amenity => {
                                const isActive = amenities.includes(amenity.id);
                                return (
                                    <label key={amenity.id} className="cursor-pointer group relative">
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={isActive}
                                            onChange={() => toggleAmenity(amenity.id)}
                                        />
                                        <div className={`h-full px-4 py-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all 
                                            ${isActive
                                                ? 'border-mosque bg-mosque/5 dark:bg-mosque/20 text-mosque dark:text-mosque-light font-medium'
                                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 group-hover:border-mosque/50'}`}>
                                            <span className={`material-icons text-lg ${isActive ? 'text-mosque' : 'text-gray-400 group-hover:text-mosque/50'}`}>
                                                {amenity.icon}
                                            </span>
                                            {amenity.label}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
                    <button
                        onClick={handleClearFilters}
                        className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors underline decoration-gray-300 underline-offset-4"
                    >
                        Clear all filters
                    </button>
                    <button
                        onClick={handleApplyFilters}
                        className="bg-mosque hover:bg-mosque/90 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-mosque/30 transition-all hover:shadow-mosque/40 flex items-center gap-2 transform active:scale-95"
                    >
                        Apply Filters
                        <span className="material-icons text-sm">arrow_forward</span>
                    </button>
                </footer>
            </main>
        </div>
    );
}
