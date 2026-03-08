import { supabase } from './supabase';
import { Property } from '../app/data/mockProperties';

// Map DB snake_case columns → camelCase Property interface
import { mapRow } from './mapper';

/** Returns all featured properties (no pagination). */
export async function getFeaturedProperties(): Promise<Property[]> {
    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('featured', true)
        .order('id')
        .limit(2);

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapRow);
}

export const PAGE_SIZE = 8;

export interface PropertyFilters {
    q?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    beds?: string;
    baths?: string;
    amenities?: string;
}

/** Returns a paginated page of non-featured properties plus total count. */
export async function getNewInMarketProperties(
    page: number,
    filters?: PropertyFilters
): Promise<{ data: Property[]; count: number }> {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
        .from('properties')
        .select('*', { count: 'exact' });

    const hasFilters = Boolean(
        filters?.q ||
        (filters?.type && filters.type !== 'All') ||
        filters?.minPrice ||
        filters?.maxPrice ||
        filters?.beds ||
        filters?.baths ||
        filters?.amenities
    );

    // Only exclude featured properties from the default "New in Market" list if no filters are active.
    // If a user is searching, they should see ALL matching properties, including featured ones.
    if (!hasFilters) {
        query = query.eq('featured', false);
    }

    // Apply Search Input (Title or Address)
    if (filters?.q) {
        query = query.or(`title.ilike.%${filters.q}%,address.ilike.%${filters.q}%`);
    }

    // Apply Filters
    if (filters?.type && filters.type !== 'All') {
        // Mock translation since we don't have a strict property type column yet, 
        // we will filter by title matching the type for now (e.g. 'House', 'Apartment')
        query = query.ilike('title', `%${filters.type}%`);
    }

    if (filters?.minPrice) {
        query = query.gte('price', parseInt(filters.minPrice, 10));
    }

    if (filters?.maxPrice) {
        query = query.lte('price', parseInt(filters.maxPrice, 10));
    }

    if (filters?.beds) {
        query = query.gte('beds', parseInt(filters.beds, 10));
    }

    if (filters?.baths) {
        query = query.gte('baths', parseInt(filters.baths, 10));
    }

    if (filters?.amenities) {
        // Amenities come as comma separated values like "Pool,Wifi"
        // We ensure the JSONB array contains ALL the requested amenities.
        const amenitiesArray = filters.amenities.split(',');
        // For JSONB columns, the SDK requires stringified JSON rather than a raw JS array.
        query = query.contains('amenities', JSON.stringify(amenitiesArray));
    }

    const { data, count, error } = await query
        .order('id')
        .range(from, to);

    if (error) throw new Error(error.message);
    return { data: (data ?? []).map(mapRow), count: count ?? 0 };
}
