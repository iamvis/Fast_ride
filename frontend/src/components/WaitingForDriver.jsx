import React from 'react';
import RideDetailCard from './RideDetailCard';
import { formatCurrency } from '../utils/fare';

const WaitingForDriver = ({ ride, setWaitingForDriver }) => {
  return (
    <div className="text-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="status-chip success"><i className="ri-steering-2-line"></i> Captain matched</span>
          <h3 className="mt-3 text-2xl font-semibold">Your driver is on the way.</h3>
        </div>
        <button type="button" onClick={() => setWaitingForDriver(false)} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-xl text-slate-700">
          <i className="ri-close-line"></i>
        </button>
      </div>

      <div className="mt-6 rounded-[28px] border border-black/5 bg-white/85 p-5">
        <div className="flex items-center justify-between gap-4 rounded-[22px] bg-slate-900 px-4 py-4 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/60">Captain</p>
            <h4 className="mt-1 text-xl font-semibold capitalize">{ride?.captain?.fullname?.firstname || 'Captain assigned'}</h4>
            <p className="mt-1 text-sm text-white/70">{ride?.captain?.vehicle?.plate || 'Plate pending'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.24em] text-white/60">OTP</p>
            <p className="mt-1 text-2xl font-semibold">{ride?.otp || '------'}</p>
          </div>
        </div>

          <div className="mt-5 space-y-1">
            <RideDetailCard title="Pickup" value={ride?.pickup || 'Pickup pending'} icon="ri-map-pin-user-fill" accent="bg-emerald-50 text-emerald-700" />
            <RideDetailCard title="Destination" value={ride?.destination || 'Destination pending'} icon="ri-map-pin-2-fill" accent="bg-amber-50 text-amber-700" />
          <RideDetailCard title="Fare" value={formatCurrency(ride?.fare)} icon="ri-wallet-3-line" accent="bg-slate-100 text-slate-900" />
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver
