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
        .order('id');

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapRow);
}

export const PAGE_SIZE = 8;

/** Returns a paginated page of non-featured properties plus total count. */
export async function getNewInMarketProperties(
    page: number
): Promise<{ data: Property[]; count: number }> {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, count, error } = await supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('featured', false)
        .order('id')
        .range(from, to);

    if (error) throw new Error(error.message);
    return { data: (data ?? []).map(mapRow), count: count ?? 0 };
}
