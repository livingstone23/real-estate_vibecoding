'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix Leaflet's default icon path issues with Next.js/Webpack
export default function Map({ address }: { address: string }) {
    useEffect(() => {
        // Only run on client-side
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
    }, []);

    // Static coordinates for demo purposes.
    // In a real app, you would geocode the address to lat/lng using a service.
    const position: [number, number] = [37.7749, -122.4194];

    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="w-full h-full rounded-lg min-h-[300px] z-0 relative">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    {address}
                </Popup>
            </Marker>
        </MapContainer>
    );
}
