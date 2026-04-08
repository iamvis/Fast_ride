import React from 'react';
import RideDetailCard from './RideDetailCard';

const LookingForDriver = ({ setVehicleFound, pickup, destination, fare = {}, vehicleType }) => {
    return (
        <div className="text-slate-900">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <span className="auth-badge">Matching driver</span>
                    <h3 className="mt-3 text-2xl font-semibold">Looking for the closest captain</h3>
                </div>
                <button type="button" onClick={() => setVehicleFound(false)} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-xl text-slate-700">
                    <i className="ri-close-line"></i>
                </button>
            </div>

            <div className="mt-6 rounded-[28px] border border-black/5 bg-white/80 p-5">
                <div className="status-chip warning"><i className="ri-loader-4-line animate-spin"></i> Matching in progress</div>
                <div className="mt-5 space-y-1">
                    <RideDetailCard title="Pickup" value={pickup || 'Waiting for pickup'} icon="ri-map-pin-user-fill" accent="bg-emerald-50 text-emerald-700" />
                    <RideDetailCard title="Destination" value={destination || 'Waiting for destination'} icon="ri-map-pin-2-fill" accent="bg-amber-50 text-amber-700" />
                    <RideDetailCard title="Estimated fare" value={`Rs. ${fare[vehicleType] ?? '--'}`} icon="ri-wallet-3-line" accent="bg-slate-100 text-slate-900" />
                </div>
            </div>
        </div>
    );
};

export default LookingForDriver;
