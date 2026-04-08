import React from 'react';
import RideDetailCard from './RideDetailCard';
import { formatCurrency } from '../utils/fare';

const ConfirmRide = ({ setConfirmRidePanel, pickup, destination, fare = {}, vehicleType, setVehicleFound, createRide, isCreatingRide }) => {
    const fareMeta = fare?._meta;
    const handleConfirm = async () => {
        try {
            const createdRide = await createRide();
            if (!createdRide) {
                return;
            }
            setVehicleFound(true);
            setConfirmRidePanel(false);
        } catch (error) {
            // The parent already surfaces the request failure to the user.
        }
    };

    return (
        <div className="text-slate-900">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <span className="auth-badge">Step 2</span>
                    <h3 className="mt-3 text-2xl font-semibold">Confirm your ride details</h3>
                </div>
                <button type="button" onClick={() => setConfirmRidePanel(false)} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-xl text-slate-700">
                    <i className="ri-close-line"></i>
                </button>
            </div>

            <div className="mt-6 rounded-[28px] border border-black/5 bg-white/80 p-5">
                <div className="status-chip success"><i className="ri-route-line"></i> Route ready for dispatch</div>
                {fareMeta ? (
                    <div className="fare-summary mt-5">
                        <div className="fare-summary-metric">
                            <span className="fare-summary-label">Distance</span>
                            <strong>{fareMeta.distanceKm} km</strong>
                        </div>
                        <div className="fare-summary-metric">
                            <span className="fare-summary-label">Travel time</span>
                            <strong>{fareMeta.durationMin} min</strong>
                        </div>
                        <div className="fare-summary-metric">
                            <span className="fare-summary-label">Pricing</span>
                            <strong>{fareMeta.trafficLabel}</strong>
                        </div>
                    </div>
                ) : null}
                <div className="mt-5 space-y-1">
                    <RideDetailCard title="Pickup" value={pickup || 'Choose a pickup point'} icon="ri-map-pin-user-fill" accent="bg-emerald-50 text-emerald-700" />
                    <RideDetailCard title="Destination" value={destination || 'Choose a destination'} icon="ri-map-pin-2-fill" accent="bg-amber-50 text-amber-700" />
                    <RideDetailCard title="Estimated fare" value={formatCurrency(fare[vehicleType])} icon="ri-wallet-3-line" accent="bg-slate-100 text-slate-900" />
                </div>
            </div>

            <button onClick={handleConfirm} disabled={isCreatingRide} className="primary-button mt-6 w-full disabled:opacity-70">
                {isCreatingRide ? 'Requesting ride...' : 'Confirm ride request'}
            </button>
        </div>
    );
};

export default ConfirmRide;
