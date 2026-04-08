import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const containerStyle = {
    width: '100%',
    height: '100vh',
};

const defaultCenter = {
    ltd: 23.2599,
    lng: 77.4126,
};

const osmStyle = {
    version: 8,
    sources: {
        osm: {
            type: 'raster',
            tiles: [
                'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors'
        }
    },
    layers: [
        {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm'
        }
    ]
};

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState(defaultCenter);
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) {
            return;
        }

        mapRef.current = new maplibregl.Map({
            container: mapContainerRef.current,
            style: osmStyle,
            center: [defaultCenter.lng, defaultCenter.ltd],
            zoom: 14,
        });

        mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        markerRef.current = new maplibregl.Marker({ color: '#111827' })
            .setLngLat([defaultCenter.lng, defaultCenter.ltd])
            .addTo(mapRef.current);

        return () => {
            markerRef.current?.remove();
            markerRef.current = null;
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) {
            return;
        }

        const updatePosition = (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({ ltd: latitude, lng: longitude });
        };

        navigator.geolocation.getCurrentPosition(updatePosition);
        const watchId = navigator.geolocation.watchPosition(updatePosition);

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    useEffect(() => {
        if (!mapRef.current || !markerRef.current) {
            return;
        }

        const lngLat = [currentPosition.lng, currentPosition.ltd];
        markerRef.current.setLngLat(lngLat);
        mapRef.current.easeTo({ center: lngLat, duration: 500 });
    }, [currentPosition]);

    return <div ref={mapContainerRef} style={containerStyle}></div>;
};

export default LiveTracking;
