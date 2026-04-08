import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RideDetailCard from './RideDetailCard';
import { getCaptainToken } from '../utils/authStorage';

const FinishRide = ({ ride, setFinishRidePanel }) => {
    const navigate = useNavigate();

    async function endRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
            rideId: ride?._id
        }, {
            headers: {
                Authorization: `Bearer ${getCaptainToken()}`
            }
        });

        if (response.status === 200) {
            navigate('/captain-home');
        }
    }

    return (
        <div className="text-slate-900">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <span className="auth-badge">Complete trip</span>
                    <h3 className="mt-3 text-2xl font-semibold">Finish the current ride and return to queue.</h3>
                </div>
                <button type="button" onClick={() => setFinishRidePanel(false)} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-xl text-slate-700">
                    <i className="ri-close-line"></i>
                </button>
            </div>

            <div className="mt-6 rounded-[28px] border border-black/5 bg-white/85 p-5">
                <div className="status-chip success"><i className="ri-checkbox-circle-line"></i> Ride in progress</div>
                <div className="mt-5 space-y-1">
                    <RideDetailCard title="Rider" value={ride?.user?.fullname?.firstname || 'Rider'} icon="ri-user-smile-line" accent="bg-yellow-50 text-yellow-700" />
                    <RideDetailCard title="Pickup" value={ride?.pickup || 'Pickup pending'} icon="ri-map-pin-user-fill" accent="bg-emerald-50 text-emerald-700" />
                    <RideDetailCard title="Destination" value={ride?.destination || 'Destination pending'} icon="ri-map-pin-2-fill" accent="bg-amber-50 text-amber-700" />
                    <RideDetailCard title="Fare" value={`Rs. ${ride?.fare ?? '--'}`} icon="ri-wallet-3-line" accent="bg-slate-100 text-slate-900" />
                </div>
            </div>

            <button onClick={endRide} className="primary-button mt-6 w-full">Finish ride</button>
        </div>
    )
}

export default FinishRide
