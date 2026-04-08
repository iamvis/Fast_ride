import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RideDetailCard from './RideDetailCard';
import { getCaptainToken } from '../utils/authStorage';

const ConfmRidePopUp = ({ ride, setConfirmRidePopUpPanel, setRidePopUpPanel }) => {
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const submitHander = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
                params: {
                    rideId: ride?._id,
                    otp,
                },
                headers: {
                    Authorization: `Bearer ${getCaptainToken()}`
                }
            });

            if (response.status === 200) {
                setConfirmRidePopUpPanel(false);
                setRidePopUpPanel(false);
                navigate('/captain-riding', { state: { ride: response.data } });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to start ride. Check the OTP and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="text-slate-900">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <span className="auth-badge">OTP verification</span>
                    <h3 className="mt-3 text-2xl font-semibold">Start the ride after rider verification.</h3>
                </div>
                <button type="button" onClick={() => setConfirmRidePopUpPanel(false)} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-xl text-slate-700">
                    <i className="ri-close-line"></i>
                </button>
            </div>

            <div className="mt-6 rounded-[28px] border border-black/5 bg-white/85 p-5">
                <div className="space-y-1">
                    <RideDetailCard title="Rider" value={`${ride?.user?.fullname?.firstname || ''} ${ride?.user?.fullname?.lastname || ''}`.trim() || 'Rider'} icon="ri-user-smile-line" accent="bg-yellow-50 text-yellow-700" />
                    <RideDetailCard title="Pickup" value={ride?.pickup || 'Pickup pending'} icon="ri-map-pin-user-fill" accent="bg-emerald-50 text-emerald-700" />
                    <RideDetailCard title="Destination" value={ride?.destination || 'Destination pending'} icon="ri-map-pin-2-fill" accent="bg-amber-50 text-amber-700" />
                    <RideDetailCard title="Fare" value={`Rs. ${ride?.fare ?? '--'}`} icon="ri-wallet-3-line" accent="bg-slate-100 text-slate-900" />
                </div>
            </div>

            <form onSubmit={submitHander} className="mt-6 space-y-4">
                <input
                    type="number"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="auth-input text-center tracking-[0.4em]"
                />

                {error ? <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">{error}</div> : null}

                <button type="submit" disabled={isSubmitting} className="primary-button w-full disabled:opacity-70">
                    {isSubmitting ? 'Starting ride...' : 'Start ride'}
                </button>
                <button type="button" onClick={() => { setConfirmRidePopUpPanel(false); setRidePopUpPanel(false); }} className="secondary-button w-full">
                    Cancel request
                </button>
            </form>
        </div>
    )
}

export default ConfmRidePopUp
