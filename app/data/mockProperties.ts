export type PropertyStatus = "Exclusive" | "New Arrival" | "FOR SALE" | "FOR RENT";

export interface Property {
    id: string;
    idSeo: string;
    title: string;
    address: string;
    price: number;
    pricePerMonth?: boolean;
    status: PropertyStatus;
    images: string[];
    imageAlt: string;
    beds: number;
    baths: number;
    area: number;
    featured: boolean;
}
