import React, { useState, useEffect } from 'react';
import H from '@here/maps-api-for-javascript';

const containerStyle = {
    width: '100%',
    height: '100vh',
};

const center = {
    lat: -3.745,
    lng: -38.523,
};

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState(center);
    const mapRef = React.useRef(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                lat: latitude,
                lng: longitude,
            });
        });

        const watchId = navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                lat: latitude,
                lng: longitude,
            });
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    useEffect(() => {
        if (mapRef.current && currentPosition) {
            const platform = new H.service.Platform({
                apikey: import.meta.env.VITE_HERE_MAPS_API_KEY,
            });
            const defaultLayers = platform.createDefaultLayers();

            const map = new H.Map(
                mapRef.current,
                defaultLayers.vector.normal.map,
                {
                    center: currentPosition,
                    zoom: 15,
                    pixelRatio: window.devicePixelRatio || 1,
                }
            );

            const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
            const ui = H.ui.UI.createDefault(map, defaultLayers);

            const marker = new H.map.Marker(currentPosition);
            map.addObject(marker);

            const updatePosition = () => {
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentPosition({ lat: latitude, lng: longitude });
                    marker.setGeometry({ lat: latitude, lng: longitude });
                    map.setCenter({ lat: latitude, lng: longitude });
                });
            };

            const intervalId = setInterval(updatePosition, 1000);
            return () => clearInterval(intervalId);
        }
    }, [currentPosition]);

    return <div ref={mapRef} style={containerStyle}></div>;
};

export default LiveTracking;
