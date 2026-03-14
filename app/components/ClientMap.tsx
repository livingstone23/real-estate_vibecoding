'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-100 flex items-center justify-center min-h-[300px] text-nordic-muted rounded-lg">
            Loading Map...
        </div>
    ),
});

interface ClientMapProps {
    address: string;
    lat?: number;
    lng?: number;
}

export default function ClientMap({ address, lat, lng }: ClientMapProps) {
    return <Map address={address} lat={lat} lng={lng} />;
}
