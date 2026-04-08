import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FinishRide from '../components/FinishRide';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import LiveTrackingLoader from '../components/LiveTrackingLoader';
import BrandMark from '../components/BrandMark';

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false);
    const finishRidePanelRef = useRef(null);
    const location = useLocation();
    const rideData = location.state?.ride;

    useGSAP(() => {
        gsap.to(finishRidePanelRef.current, {
            transform: finishRidePanel ? 'translateY(0)' : 'translateY(100%)',
            duration: 0.25,
        });
    }, [finishRidePanel]);

    return (
        <div className='app-shell relative overflow-hidden'>
            <LiveTrackingLoader />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.16),rgba(15,23,42,0.04)_35%,rgba(244,239,230,0.88)_76%,rgba(244,239,230,0.98)_100%)]" />

            <div className='absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 sm:p-6'>
                <BrandMark to="/captain-home" />
                <Link to='/captain-home' className='pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/88 text-slate-900 shadow-lg backdrop-blur'>
                    <i className="ri-home-5-line text-xl"></i>
                </Link>
            </div>

            <div className='absolute inset-x-0 bottom-0 z-20 px-4 pb-5 sm:px-6 sm:pb-6'>
                <div className='mx-auto max-w-3xl panel-card rounded-[28px] px-5 py-5 sm:px-6'>
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div>
                            <span className="status-chip success"><i className="ri-steering-2-line"></i> Active rider onboard</span>
                            <h2 className='mt-3 text-2xl font-semibold text-slate-900'>Drive safe and finish this ride when you arrive.</h2>
                        </div>
                        <div className='text-right'>
                            <p className='text-xs uppercase tracking-[0.24em] text-[#8a8075]'>Trip fare</p>
                            <p className='mt-2 text-2xl font-semibold text-slate-900'>Rs. {rideData?.fare ?? '--'}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setFinishRidePanel(true)}
                        className='primary-button mt-6 w-full'
                    >
                        Complete ride
                    </button>
                </div>
            </div>

            <div ref={finishRidePanelRef} className='panel-card fixed bottom-0 z-30 w-full translate-y-full px-4 py-6 sm:px-6'>
                <div className='mx-auto max-w-3xl'>
                    <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
                </div>
            </div>
        </div>
    )
}

export default CaptainRiding
