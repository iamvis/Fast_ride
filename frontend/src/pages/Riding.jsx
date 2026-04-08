import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import LiveTrackingLoader from '../components/LiveTrackingLoader';
import RideDetailCard from '../components/RideDetailCard';
import { UserDataContext } from '../context/UserContext';
import LoaderScreen from '../components/LoaderScreen';
import { getUserToken } from '../utils/authStorage';

const Riding = () => {
    const location = useLocation();
    const { ride } = location.state || {};
    const { socket } = useContext(SocketContext);
    const { user } = useContext(UserDataContext);
    const navigate = useNavigate();
    const [currentRide, setCurrentRide] = useState(ride || null);
    const [isPaying, setIsPaying] = useState(false);
    const [paymentError, setPaymentError] = useState('');

    useEffect(() => {
        setCurrentRide(ride || null);
    }, [ride]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        const handleRideEnded = (endedRide) => {
            setCurrentRide(endedRide);
        };

        socket.on('ride-ended', handleRideEnded);

        return () => {
            socket.off('ride-ended', handleRideEnded);
        };
    }, [navigate, socket]);

    const loadRazorpayScript = () => new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

    const handlePayment = async () => {
        if (!currentRide?._id) {
            return;
        }

        setPaymentError('');
        setIsPaying(true);

        try {
            if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
                throw new Error('Razorpay key is missing in the frontend environment.');
            }

            const isScriptLoaded = await loadRazorpayScript();

            if (!isScriptLoaded) {
                throw new Error('Unable to load Razorpay checkout.');
            }

            const orderResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/payment-order`, {
                rideId: currentRide._id
            }, {
                headers: {
                    Authorization: `Bearer ${getUserToken()}`
                }
            });

            const { order } = orderResponse.data;

            const razorpay = new window.Razorpay({
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'Fastride',
                description: `Ride payment for ${currentRide.destination || 'your trip'}`,
                order_id: order.id,
                handler: async (response) => {
                    try {
                        const verifyResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/verify-payment`, {
                            rideId: currentRide._id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, {
                            headers: {
                                Authorization: `Bearer ${getUserToken()}`
                            }
                        });

                        setCurrentRide(verifyResponse.data);
                        setPaymentError('');
                    } catch (error) {
                        setPaymentError(error.response?.data?.message || 'Payment succeeded, but verification could not be completed.');
                    } finally {
                        setIsPaying(false);
                    }
                },
                prefill: {
                    name: `${user?.fullname?.firstname || ''} ${user?.fullname?.lastname || ''}`.trim(),
                    email: user?.email || ''
                },
                theme: {
                    color: '#0f172a'
                },
                modal: {
                    ondismiss: () => {
                        setIsPaying(false);
                    }
                }
            });

            razorpay.on('payment.failed', (response) => {
                setPaymentError(response.error?.description || 'Payment could not be completed.');
                setIsPaying(false);
            });

            razorpay.open();
        } catch (error) {
            setPaymentError(error.response?.data?.message || error.message || 'Unable to start payment.');
            setIsPaying(false);
        }
    };

    if (!currentRide) {
        return <LoaderScreen title="Loading your trip" subtitle="We are getting your ride and payment details ready." />;
    }

    const isRideCompleted = currentRide?.status === 'completed';
    const isPaymentComplete = currentRide?.paymentStatus === 'paid';
    const paymentLabel = isPaymentComplete ? 'Paid online' : isRideCompleted ? 'Pending online payment' : 'Available after trip ends';
    const statusLabel = isRideCompleted ? 'Ride completed' : 'Ride in progress';

    return (
        <div className='app-shell relative overflow-hidden'>
            <LiveTrackingLoader />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.18),rgba(15,23,42,0.04)_35%,rgba(244,239,230,0.88)_76%,rgba(244,239,230,0.98)_100%)]" />

            <div className='absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 sm:p-6'>
                <Link to='/home' className='pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/88 text-slate-900 shadow-lg backdrop-blur'>
                    <i className="ri-home-5-line text-xl"></i>
                </Link>
                <div className={`status-chip pointer-events-auto ${isRideCompleted ? 'warning' : 'success'}`}><i className="ri-road-map-line"></i> {statusLabel}</div>
            </div>

            <div className='absolute inset-x-0 bottom-0 z-20 px-4 pb-5 sm:px-6 sm:pb-6'>
                <div className='mx-auto max-w-3xl panel-card rounded-[28px] px-5 py-5 sm:px-6'>
                    <div className='flex items-center justify-between gap-4'>
                        <div>
                            <span className="auth-badge">Current ride</span>
                            <h2 className='mt-3 text-2xl font-semibold text-slate-900'>{isRideCompleted ? 'Your trip is complete. Finish payment when you are ready.' : 'You are headed to your destination.'}</h2>
                        </div>
                        <div className='text-right'>
                            <p className='text-xs uppercase tracking-[0.24em] text-[#8a8075]'>Fare</p>
                            <p className='mt-2 text-2xl font-semibold text-slate-900'>Rs. {currentRide?.fare ?? '--'}</p>
                        </div>
                    </div>

                    <div className='mt-6 rounded-[24px] bg-slate-900 px-5 py-4 text-white'>
                        <p className='text-xs uppercase tracking-[0.24em] text-white/60'>Captain details</p>
                        <div className='mt-3 flex items-center justify-between gap-4'>
                            <div>
                                <h3 className='text-xl font-semibold capitalize'>{currentRide?.captain?.fullname?.firstname || 'Captain'}</h3>
                                <p className='mt-1 text-sm text-white/70'>{currentRide?.captain?.vehicle?.plate || 'Plate pending'}</p>
                            </div>
                            <i className="ri-steering-2-line text-3xl text-white/80"></i>
                        </div>
                    </div>

                    <div className='mt-5 rounded-[24px] border border-black/5 bg-white/80 px-5 py-3'>
                        <RideDetailCard title="Destination" value={currentRide?.destination || 'Destination pending'} icon="ri-map-pin-2-fill" accent="bg-amber-50 text-amber-700" />
                        <RideDetailCard title="Payment" value={paymentLabel} icon="ri-wallet-3-line" accent="bg-slate-100 text-slate-900" />
                    </div>

                    {paymentError ? (
                        <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">{paymentError}</div>
                    ) : null}

                    <button
                        onClick={handlePayment}
                        disabled={!isRideCompleted || isPaymentComplete || isPaying}
                        className='primary-button mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60'
                    >
                        {isPaymentComplete ? 'Payment completed' : isPaying ? 'Opening payment...' : isRideCompleted ? 'Pay with Razorpay' : 'Payment available after trip ends'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Riding
