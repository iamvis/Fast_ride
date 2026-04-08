import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import WaitingForDriver from "../components/WaitingForDriver";
import LookingForDriver from "../components/LookingForDriver";
import { SocketContext } from "../context/SocketContext";
import { Link, useNavigate } from "react-router-dom";
import LiveTrackingLoader from "../components/LiveTrackingLoader";
import { UserDataContext } from "../context/UserContext";
import BrandMark from "../components/BrandMark";
import { clearUserToken, getUserToken } from "../utils/authStorage";

const Home = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [ride, setRide] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [isSearchingFare, setIsSearchingFare] = useState(false);
  const [isCreatingRide, setIsCreatingRide] = useState(false);
  const vehiclePanelRef = useRef(null);
  const panelRef = useRef(null);
  const panelcloseRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const navigate = useNavigate();

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  const getAuthHeaders = () => {
    const token = getUserToken();
    if (!token) {
      navigate('/login');
      throw new Error('Please log in to continue.');
    }

    return {
      Authorization: `Bearer ${token}`
    };
  };

  useEffect(() => {
    if (!socket || !user?._id) {
      return;
    }

    socket.emit("join", { userType: "user", userId: user._id });

    const handleRideConfirmed = (currentRide) => {
      setVehicleFound(false);
      setWaitingForDriver(true);
      setRide(currentRide);
    };

    const handleRideStarted = (currentRide) => {
      setWaitingForDriver(false);
      navigate('/riding', { state: { ride: currentRide } });
    };

    socket.on('ride-confirmed', handleRideConfirmed);
    socket.on('ride-started', handleRideStarted);

    return () => {
      socket.off('ride-confirmed', handleRideConfirmed);
      socket.off('ride-started', handleRideStarted);
    };
  }, [navigate, socket, user?._id]);

  const fetchSuggestions = async (value, setter) => {
    if (value.trim().length < 3) {
      setter([]);
      return;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
        params: { input: value },
        headers: getAuthHeaders()
      });
      setter(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        clearUserToken();
        navigate('/login');
        return;
      }
      console.log(error.response?.data || error.message);
    }
  };

  const handlePickupChange = async (e) => {
    const value = e.target.value;
    setPickup(value);
    await fetchSuggestions(value, setPickupSuggestions);
  };

  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);
    await fetchSuggestions(value, setDestinationSuggestions);
  };

  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: panelOpen ? "44%" : "0%",
      padding: panelOpen ? 20 : 0,
      duration: 0.25,
    });
    gsap.to(panelcloseRef.current, {
      opacity: panelOpen ? 1 : 0,
      duration: 0.2,
    });
  }, [panelOpen]);

  useGSAP(() => {
    gsap.to(vehiclePanelRef.current, {
      transform: vehiclePanel ? "translateY(0)" : "translateY(100%)",
      duration: 0.25,
    });
  }, [vehiclePanel]);

  useGSAP(() => {
    gsap.to(confirmRidePanelRef.current, {
      transform: confirmRidePanel ? "translateY(0)" : "translateY(100%)",
      duration: 0.25,
    });
  }, [confirmRidePanel]);

  useGSAP(() => {
    gsap.to(vehicleFoundRef.current, {
      transform: vehicleFound ? "translateY(0)" : "translateY(100%)",
      duration: 0.25,
    });
  }, [vehicleFound]);

  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      transform: waitingForDriver ? "translateY(0)" : "translateY(100%)",
      duration: 0.25,
    });
  }, [waitingForDriver]);

  async function findTrip() {
    try {
      if (!pickup || !destination) {
        return alert("Please enter both pickup and destination.");
      }

      setIsSearchingFare(true);
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
        params: {
          pickup,
          destination
        },
        headers: getAuthHeaders()
      });

      setFare(response.data);
      setVehiclePanel(true);
      setPanelOpen(false);
    } catch (error) {
      if (error.response?.status === 401) {
        clearUserToken();
        navigate('/login');
        return;
      }
      console.error("Error fetching fare:", error.response?.data || error.message);
      alert(`Error fetching fare: ${error.response?.data?.message || error.message || "Something went wrong."}`);
    } finally {
      setIsSearchingFare(false);
    }
  }

  async function createRide() {
    try {
      if (!vehicleType) {
        throw new Error('Please choose a vehicle type.');
      }

      setIsCreatingRide(true);
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
        pickup,
        destination,
        vehicleType,
      }, {
        headers: getAuthHeaders()
      });

      setRide(response.data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        clearUserToken();
        navigate('/login');
        return null;
      }
      console.error("Error creating ride:", error.response?.data || error.message);
      alert(`Error creating ride: ${error.response?.data?.message || error.message || 'Something went wrong.'}`);
      throw error;
    } finally {
      setIsCreatingRide(false);
    }
  }

  const userName = user?.fullname?.firstname || 'Rider';

  return (
    <div className="app-shell relative overflow-hidden">
      <LiveTrackingLoader />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.18),rgba(15,23,42,0.04)_32%,rgba(244,239,230,0.92)_72%,rgba(244,239,230,0.98)_100%)]" />

      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 sm:p-6">
        <BrandMark to="/home" />
        <Link to="/user/logout" className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/88 text-slate-900 shadow-lg backdrop-blur">
          <i className="ri-logout-box-r-line text-xl"></i>
        </Link>
      </div>

      <div className="absolute inset-x-0 top-24 z-10 px-4 sm:px-6">
        <div className="glass-card mx-auto max-w-3xl rounded-[30px] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="auth-badge">Welcome back</span>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Plan the next move, {userName}.</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#6c655c]">Set pickup and destination, compare ride types, and watch the trip progress on one cleaner screen.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[250px]">
              <div className="metric-tile">
                <p className="text-xs uppercase tracking-[0.26em] text-[#8a8075]">Pickup</p>
                <p className="mt-2 truncate text-sm font-semibold">{pickup || 'Add location'}</p>
              </div>
              <div className="metric-tile">
                <p className="text-xs uppercase tracking-[0.26em] text-[#8a8075]">Destination</p>
                <p className="mt-2 truncate text-sm font-semibold">{destination || 'Add stop'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end">
        <div className="panel-card relative px-4 pb-6 pt-5 sm:px-6">
          <h5
            ref={panelcloseRef}
            onClick={() => setPanelOpen(false)}
            className="absolute right-6 top-6 cursor-pointer text-2xl opacity-0"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>

          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="auth-badge">Book a ride</span>
                <h4 className="mt-3 text-2xl font-semibold">Where do you want to go?</h4>
              </div>
              <button onClick={findTrip} disabled={isSearchingFare} className="primary-button hidden sm:inline-flex disabled:opacity-70">
                {isSearchingFare ? 'Finding fare...' : 'Find trip'}
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <div className="relative">
                <i className="ri-map-pin-user-fill pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-slate-500"></i>
                <input
                  onClick={() => { setPanelOpen(true); setActiveField('pickup'); }}
                  value={pickup}
                  onChange={handlePickupChange}
                  className="auth-input has-leading-icon"
                  type="text"
                  placeholder="Add a pickup location"
                />
              </div>

              <div className="relative">
                <i className="ri-map-pin-2-fill pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-slate-500"></i>
                <input
                  onClick={() => { setPanelOpen(true); setActiveField('destination'); }}
                  value={destination}
                  onChange={handleDestinationChange}
                  className="auth-input has-leading-icon"
                  type="text"
                  placeholder="Enter your destination"
                />
              </div>
            </div>

            <button onClick={findTrip} disabled={isSearchingFare} className="primary-button mt-4 w-full sm:hidden disabled:opacity-70">
              {isSearchingFare ? 'Finding fare...' : 'Find trip'}
            </button>
          </div>
        </div>

        <div ref={panelRef} className="h-0 overflow-hidden bg-transparent px-4 sm:px-6">
          <div className="mx-auto max-w-3xl pb-4">
            <LocationSearchPanel
              suggestions={activeField === "pickup" ? pickupSuggestions : destinationSuggestions}
              setPanelOpen={setPanelOpen}
              setPickup={setPickup}
              setDestination={setDestination}
              activeField={activeField}
            />
          </div>
        </div>
      </div>

      <div ref={vehiclePanelRef} className="panel-card fixed bottom-0 z-30 w-full translate-y-full px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <VehiclePanel
            setVehicleType={setVehicleType}
            fare={fare}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehiclePanel={setVehiclePanel}
          />
        </div>
      </div>

      <div ref={confirmRidePanelRef} className="panel-card fixed bottom-0 z-30 w-full translate-y-full px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <ConfirmRide
            pickup={pickup}
            fare={fare}
            destination={destination}
            createRide={createRide}
            vehicleType={vehicleType}
            setVehicleFound={setVehicleFound}
            setConfirmRidePanel={setConfirmRidePanel}
            isCreatingRide={isCreatingRide}
          />
        </div>
      </div>

      <div ref={vehicleFoundRef} className="panel-card fixed bottom-0 z-30 w-full translate-y-full px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <LookingForDriver
            pickup={pickup}
            fare={fare}
            destination={destination}
            vehicleType={vehicleType}
            setVehicleFound={setVehicleFound}
          />
        </div>
      </div>

      <div ref={waitingForDriverRef} className="panel-card fixed bottom-0 z-30 w-full translate-y-full px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <WaitingForDriver
            ride={ride}
            setWaitingForDriver={setWaitingForDriver}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
