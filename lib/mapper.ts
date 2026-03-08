import { Property } from '../app/data/mockProperties';
// import { Database } from '../types/supabase'; // Remove unused if not enforcing row typing yet

// Map DB snake_case columns → camelCase Property interface
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapRow(row: any): Property & { idSeo: string; images: string[] } {
    return {
        id: row.id,
        title: row.title,
        address: row.address,
        price: Number(row.price),
        pricePerMonth: row.price_per_month ?? false,
        status: row.status,
        imageUrl: row.image_url,
        imageAlt: row.image_alt,
        beds: Number(row.beds),
        baths: Number(row.baths),
        area: Number(row.area),
        featured: row.featured,
        idSeo: row.id_seo,
        images: row.images || [row.image_url], // Fallback if empty array
    };
}
