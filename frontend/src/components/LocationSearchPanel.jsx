import React from 'react';

const LocationSearchPanel = ({ suggestions = [], setPanelOpen, setPickup, setDestination, activeField }) => {
    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion);
        } else if (activeField === 'destination') {
            setDestination(suggestion);
        }

        setPanelOpen(false);
    };

    if (!suggestions.length) {
        return (
            <div className="rounded-[24px] border border-dashed border-black/10 bg-white/70 p-5 text-sm text-[#6c655c]">
                Start typing at least 3 characters to see matching pickup or destination suggestions.
            </div>
        );
    }

    return (
        <div className="space-y-3 pb-4">
            {suggestions.map((suggestion, idx) => (
                <button
                    key={`${suggestion}-${idx}`}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex w-full items-start gap-4 rounded-[22px] border border-black/5 bg-white/80 px-4 py-4 text-left transition hover:border-slate-900/10 hover:bg-white"
                >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
                        <i className="ri-map-pin-2-fill text-lg"></i>
                    </span>
                    <span>
                        <span className="block text-xs uppercase tracking-[0.22em] text-[#8a8075]">Suggested stop</span>
                        <span className="mt-1 block text-sm font-medium text-slate-900">{suggestion}</span>
                    </span>
                </button>
            ))}
        </div>
    );
};

export default LocationSearchPanel;
