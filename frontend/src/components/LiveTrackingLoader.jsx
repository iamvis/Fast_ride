import React, { Suspense, lazy } from 'react';

const LiveTracking = lazy(() => import('./LiveTracking'));

const fallbackStyle = {
    width: '100%',
    height: '100vh',
    background: 'linear-gradient(180deg, rgba(15,23,42,0.12), rgba(15,23,42,0.02) 35%, rgba(244,239,230,0.9) 100%)'
};

const LiveTrackingLoader = () => {
    return (
        <Suspense fallback={<div style={fallbackStyle} />}>
            <LiveTracking />
        </Suspense>
    );
};

export default LiveTrackingLoader;
