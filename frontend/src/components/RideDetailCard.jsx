import React from 'react';

const RideDetailCard = ({ title, value, icon, accent = 'bg-slate-100 text-slate-900' }) => {
    return (
        <div className="info-row">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${accent}`}>
                <i className={`${icon} text-lg`}></i>
            </div>
            <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.25em] text-[#8a8075]">{title}</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
            </div>
        </div>
    );
};

export default RideDetailCard;
