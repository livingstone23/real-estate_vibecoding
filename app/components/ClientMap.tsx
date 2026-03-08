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

export default function ClientMap({ address }: { address: string }) {
    return <Map address={address} />;
}
