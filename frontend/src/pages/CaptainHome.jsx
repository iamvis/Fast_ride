import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ConfmRidePopUp from "../components/ConfmRidePopUp";
import { CaptainDataContext } from "../context/CaptainContext";
import { SocketContext } from "../context/SocketContext";
import LiveTrackingLoader from "../components/LiveTrackingLoader";
import axios from 'axios';
import BrandMark from "../components/BrandMark";
import { getCaptainToken } from "../utils/authStorage";

const CaptainHome = () => {
  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const ridePopUpPanelRef = useRef(null);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const confirmRidePopUpPanelRef = useRef(null);
  const [locationStatus, setLocationStatus] = useState('Requesting browser location');
  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);
  const [ride, setRide] = useState(null);

  useEffect(() => {
    if (!socket || !captain?._id) {
      return;
    }

    socket.emit('join', {
      userId: captain._id,
      userType: 'captain'
    });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          setLocationStatus('Live location shared');
          socket.emit('update-location-captain', {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
        }, () => {
          setLocationStatus('Location permission required');
        }, {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 10000,
        })
      } else {
        setLocationStatus('Geolocation not supported');
      }
    };

    const handleNewRide = (data) => {
      setRide(data);
      setRidePopUpPanel(true);
    };

    socket.on('new-ride', handleNewRide);

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();

    return () => {
      clearInterval(locationInterval);
      socket.off('new-ride', handleNewRide);
    };
  }, [captain?._id, socket]);

  async function confirmRide() {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
      rideId: ride?._id,
      captainId: captain?._id
    }, {
      headers: {
        Authorization: `Bearer ${getCaptainToken()}`
      }
    });

    if (response.status === 200) {
      setRide(response.data);
      setRidePopUpPanel(false);
      setConfirmRidePopUpPanel(true);
    }
  }

  useGSAP(() => {
    gsap.to(ridePopUpPanelRef.current, {
      transform: ridePopUpPanel ? "translateY(0)" : "translateY(100%)",
      duration: 0.25,
    });
  }, [ridePopUpPanel]);

  useGSAP(() => {
    gsap.to(confirmRidePopUpPanelRef.current, {
      transform: confirmRidePopUpPanel ? "translateY(0)" : "translateY(100%)",
      duration: 0.25,
    });
  }, [confirmRidePopUpPanel]);

  return (
    <div className="app-shell relative overflow-hidden">
      <LiveTrackingLoader />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.16),rgba(15,23,42,0.02)_35%,rgba(244,239,230,0.9)_76%,rgba(244,239,230,0.98)_100%)]" />

      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 sm:p-6">
        <BrandMark to="/captain-home" />
        <Link to="/captain/logout" className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/88 text-slate-900 shadow-lg backdrop-blur">
          <i className="ri-logout-box-r-line text-xl"></i>
        </Link>
      </div>

      <div className="absolute inset-x-0 top-24 z-10 px-4 sm:px-6">
        <div className="glass-card mx-auto max-w-3xl rounded-[30px] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="auth-badge">Captain console</span>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Stay online and ready for the next trip.</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#6c655c]">Your live location is updating in the background so nearby riders can match with you faster.</p>
            </div>
            <div className={`status-chip self-start sm:self-end ${locationStatus === 'Live location shared' ? 'success' : 'warning'}`}><i className="ri-radar-line"></i> {locationStatus}</div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-5 sm:px-6 sm:pb-6">
        <div className="mx-auto max-w-3xl panel-card rounded-[28px] px-5 py-5 sm:px-6">
          <CaptainDetails />
        </div>
      </div>

      <div ref={ridePopUpPanelRef} className="panel-card fixed bottom-0 z-30 w-full translate-y-full px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <RidePopUp
            ride={ride}
            setRidePopUpPanel={setRidePopUpPanel}
            confirmRide={confirmRide}
            setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          />
        </div>
      </div>

      <div ref={confirmRidePopUpPanelRef} className="panel-card fixed bottom-0 z-30 w-full translate-y-full px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <ConfmRidePopUp
            ride={ride}
            setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
            setRidePopUpPanel={setRidePopUpPanel}
          />
        </div>
      </div>
    </div>
  );
};

export default CaptainHome;
