// Types only – data now lives in Supabase.
export type PropertyStatus = "Exclusive" | "New Arrival" | "FOR SALE" | "FOR RENT";

export interface Property {
    id: string;
    title: string;
    address: string;
    price: number;
    pricePerMonth?: boolean;
    status: PropertyStatus;
    imageUrl: string;
    imageAlt: string;
    beds: number;
    baths: number;
    area: number;
    featured: boolean;
}
