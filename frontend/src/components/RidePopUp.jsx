import React from 'react';
import RideDetailCard from './RideDetailCard';

const RidePopUp = ({ ride, setRidePopUpPanel, setConfirmRidePopUpPanel, confirmRide }) => {
  const riderName = `${ride?.user?.fullname?.firstname || ''} ${ride?.user?.fullname?.lastname || ''}`.trim();

  return (
    <div className="text-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="status-chip warning"><i className="ri-notification-3-line"></i> New request</span>
          <h3 className="mt-3 text-2xl font-semibold">A rider is ready nearby.</h3>
        </div>
        <button type="button" onClick={() => setRidePopUpPanel(false)} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-xl text-slate-700">
          <i className="ri-close-line"></i>
        </button>
      </div>

      <div className="mt-6 rounded-[28px] border border-yellow-200 bg-yellow-50/80 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-[#8a8075]">Pickup request</p>
            <h4 className="mt-1 text-xl font-semibold">{riderName || 'New rider'}</h4>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.26em] text-[#8a8075]">Estimated</p>
            <p className="mt-1 text-lg font-semibold">Rs. {ride?.fare ?? '--'}</p>
          </div>
        </div>

        <div className="mt-5 space-y-1">
          <RideDetailCard title="Pickup" value={ride?.pickup || 'Pickup pending'} icon="ri-map-pin-user-fill" accent="bg-emerald-50 text-emerald-700" />
          <RideDetailCard title="Destination" value={ride?.destination || 'Destination pending'} icon="ri-map-pin-2-fill" accent="bg-amber-50 text-amber-700" />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button onClick={async () => { await confirmRide(); setConfirmRidePopUpPanel(true); }} className="primary-button w-full">Accept ride</button>
        <button onClick={() => setRidePopUpPanel(false)} className="secondary-button w-full">Ignore for now</button>
      </div>
    </div>
  )
}

export default RidePopUp
