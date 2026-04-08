import React, { useContext } from 'react';
import { CaptainDataContext } from '../context/CaptainContext';

const CaptainDetails = () => {
 const { captain } = useContext(CaptainDataContext);
 const totalEarnings = captain?.stats?.totalEarnings || 0;
 const completedTrips = captain?.stats?.completedTrips || 0;
 const vehicleType = captain?.vehicle?.vehicletype || 'car';

  return (
    <div className="space-y-5 text-slate-900">
      <div className="glass-card rounded-[28px] p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-xl font-semibold text-white">
              {captain?.fullname?.firstname?.[0] || 'C'}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-[#8a8075]">Captain profile</p>
              <h4 className="mt-1 text-xl font-semibold capitalize">{`${captain?.fullname?.firstname || ''} ${captain?.fullname?.lastname || ''}`.trim() || 'Captain'}</h4>
              <p className="mt-1 text-sm text-[#6c655c]">{captain?.vehicle?.color || 'Vehicle'} {vehicleType} • {captain?.vehicle?.plate || 'Plate pending'}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.26em] text-[#8a8075]">Total earnings</p>
            <p className="mt-1 text-2xl font-semibold">Rs. {totalEarnings}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="metric-tile text-center">
          <i className="ri-timer-line text-2xl text-slate-900"></i>
          <p className="mt-3 text-xl font-semibold">Live</p>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#8a8075]">Status</p>
        </div>
        <div className="metric-tile text-center">
          <i className="ri-road-map-line text-2xl text-slate-900"></i>
          <p className="mt-3 text-xl font-semibold">{completedTrips}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#8a8075]">Trips</p>
        </div>
        <div className="metric-tile text-center">
          <i className="ri-taxi-line text-2xl text-slate-900"></i>
          <p className="mt-3 text-xl font-semibold capitalize">{vehicleType}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#8a8075]">Vehicle</p>
        </div>
      </div>
    </div>
  )
}

export default CaptainDetails
