import React from 'react';
import { formatCurrency } from '../utils/fare';

const vehicles = [
  {
    key: 'car',
    title: 'Fastride Go',
    subtitle: 'Affordable city rides',
    eta: '2 min away',
    capacity: 4,
    image: '/vehicle-car.svg',
    fallback: '/vehicle-car.svg',
  },
  {
    key: 'auto',
    title: 'Fastride Auto',
    subtitle: 'Quick and economical for shorter trips',
    eta: '3 min away',
    capacity: 3,
    image: '/vehicle-auto.svg',
    fallback: '/vehicle-auto.svg',
  },
  {
    key: 'moto',
    title: 'Fastride Moto',
    subtitle: 'Fastest option for solo riders',
    eta: '1 min away',
    capacity: 1,
    image: '/vehicle-moto.svg',
    fallback: '/vehicle-moto.svg',
  },
];

const VehiclePanel = ({ setVehiclePanel, setConfirmRidePanel, setVehicleType, fare = {} }) => {
  const fareMeta = fare?._meta;

  const handleSelect = (type) => {
    setVehicleType(type);
    setConfirmRidePanel(true);
    setVehiclePanel(false);
  };

  return (
    <div className="space-y-4 text-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="auth-badge">Pick a ride</span>
          <h3 className="mt-3 text-2xl font-semibold">Choose the vehicle that fits this trip.</h3>
          {fareMeta ? (
            <p className="mt-3 text-sm text-[#6c655c]">
              {fareMeta.distanceKm} km, about {fareMeta.durationMin} min, {fareMeta.trafficLabel.toLowerCase()}.
            </p>
          ) : null}
        </div>
        <button type="button" onClick={() => setVehiclePanel(false)} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-xl text-slate-700">
          <i className="ri-close-line"></i>
        </button>
      </div>

      {vehicles.map((vehicle) => (
        <button
          key={vehicle.key}
          type="button"
          onClick={() => handleSelect(vehicle.key)}
          className="flex w-full items-center gap-4 rounded-[24px] border border-black/5 bg-white/85 p-4 text-left transition hover:-translate-y-0.5 hover:border-slate-900/12 hover:bg-white"
        >
          <img
            className="h-16 w-20 rounded-2xl object-cover bg-slate-100"
            src={vehicle.image}
            alt={vehicle.title}
            onError={(event) => {
              if (event.currentTarget.src.endsWith(vehicle.fallback)) {
                return;
              }
              event.currentTarget.src = vehicle.fallback;
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold">{vehicle.title}</h4>
              <span className="text-sm text-[#6c655c]"><i className="ri-user-3-line"></i> {vehicle.capacity}</span>
            </div>
            <p className="mt-1 text-sm text-slate-700">{vehicle.eta}</p>
            <p className="mt-1 text-sm text-[#6c655c]">{vehicle.subtitle}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="fare-pill"><i className="ri-shield-check-line"></i> Base fare included</span>
              <span className="fare-pill"><i className="ri-time-line"></i> Traffic-adjusted estimate</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8a8075]">Fare</p>
            <p className="mt-2 text-xl font-semibold">{formatCurrency(fare[vehicle.key])}</p>
            <p className="mt-1 text-xs text-[#6c655c]">Estimated before tolls</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default VehiclePanel;
