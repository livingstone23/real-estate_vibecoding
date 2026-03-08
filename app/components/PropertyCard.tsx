import React from 'react';
import Link from 'next/link';
import { Property } from '../data/mockProperties';

interface PropertyCardProps {
    property: Property;
    isFeatured?: boolean;
}

export const PropertyCard = ({ property, isFeatured = false }: PropertyCardProps) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(price);
    };

    if (isFeatured) {
        return (
            <Link href={`/properties/${property.idSeo}`} className="group relative rounded-xl overflow-hidden shadow-soft bg-white dark:bg-white/5 cursor-pointer block h-full">
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                    <img
                        alt={property.imageAlt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={property.images[0]}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-nordic-dark dark:text-white">
                        {property.status}
                    </div>
                    <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center text-nordic-dark hover:bg-mosque hover:text-white transition-all">
                        <span className="material-icons text-xl">favorite_border</span>
                    </button>
                    <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                </div>

                <div className="p-6 relative">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-xl font-medium text-nordic-dark dark:text-white group-hover:text-mosque transition-colors">{property.title}</h3>
                            <p className="text-nordic-muted text-sm flex items-center gap-1 mt-1">
                                <span className="material-icons text-sm">place</span> {property.address}
                            </p>
                        </div>
                        <span className="text-xl font-semibold text-mosque dark:text-primary">{formatPrice(property.price)}</span>
                    </div>

                    <div className="flex items-center gap-6 mt-6 pt-6 border-t border-nordic-dark/5 dark:border-white/10">
                        <div className="flex items-center gap-2 text-nordic-muted text-sm">
                            <span className="material-icons text-lg">king_bed</span> {property.beds} Beds
                        </div>
                        <div className="flex items-center gap-2 text-nordic-muted text-sm">
                            <span className="material-icons text-lg">bathtub</span> {property.baths} Baths
                        </div>
                        <div className="flex items-center gap-2 text-nordic-muted text-sm">
                            <span className="material-icons text-lg">square_foot</span> {property.area.toLocaleString()} m²
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    // Regular Non-Featured Card ("New In Market")
    return (
        <Link href={`/properties/${property.idSeo}`} className="bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col block">
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    alt={property.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={property.images[0]}
                />
                <button className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-black/50 rounded-full hover:bg-mosque hover:text-white transition-colors text-nordic-dark">
                    <span className="material-icons text-lg">favorite_border</span>
                </button>
                <div className={`absolute bottom-3 left-3 text-white text-xs font-bold px-2 py-1 rounded ${property.status === 'FOR RENT' ? 'bg-mosque/90' : 'bg-nordic-dark/90'}`}>
                    {property.status}
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-bold text-lg text-nordic-dark dark:text-white">
                        {formatPrice(property.price)}
                        {property.pricePerMonth && <span className="text-sm font-normal text-nordic-muted">/mo</span>}
                    </h3>
                </div>
                <h4 className="text-nordic-dark dark:text-gray-200 font-medium truncate mb-1">{property.title}</h4>
                <p className="text-nordic-muted text-xs mb-4">{property.address}</p>

                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-1 text-nordic-muted text-xs">
                        <span className="material-icons text-sm text-mosque/80">king_bed</span> {property.beds}
                    </div>
                    <div className="flex items-center gap-1 text-nordic-muted text-xs">
                        <span className="material-icons text-sm text-mosque/80">bathtub</span> {property.baths}
                    </div>
                    <div className="flex items-center gap-1 text-nordic-muted text-xs">
                        <span className="material-icons text-sm text-mosque/80">square_foot</span> {property.area}m²
                    </div>
                </div>
            </div>
        </Link>
    );
};
