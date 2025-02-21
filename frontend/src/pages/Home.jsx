import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios"
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import WaitingForDriver from "../components/WaitingForDriver";
import LookingForDriver from "../components/LookingForDriver";
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";
import { UserDataContext } from "../context/UserContext";


const Home = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState();
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [ride, setRide] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const vehiclePanelRef = useRef(null);
  const panelRef = useRef(null);
  const panelcloseRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const { socket } = useContext( SocketContext )
  const {user} = useContext(UserDataContext)
  const navigate = useNavigate()

  useEffect (()=>{
    socket.emit("join", 
    {userType:"user", userId:user._id})},
    [user])

  socket.on('ride-confirmed', ride =>{
    setVehicleFound(false);
    setWaitingForDriver(true);
    setRide(ride)
  })


  socket.on('ride-started', ride => {
    console.log("ride")
    setWaitingForDriver(false)
    navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
})


const handlePickupChange = async (e) => {
  const input= e.target.value;
  setPickup(e.target.value)

  if (input.length < 3) {
    setPickupSuggestions([]); // Avoid calling API for short inputs
    return;
  }
  try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
          params: { input: e.target.value },
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }

      })
      setPickupSuggestions(response.data)
  } catch {
      // handle error
  }
}

const handleDestinationChange = async (e) => {
  const input= e.target.value;
  setDestination(e.target.value)
  if (input.length < 3) {
    setDestinationSuggestions([]); // Avoid calling API for short inputs
    return;
  }
  try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
          params: { input: e.target.value },
          headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
          }
      })
      setDestinationSuggestions(response.data)
  } catch {
      // handle error
  }
}


  //for form data handler
  const submitHandler = (e) => {
    e.preventDefault();
  };

  //for animation
  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
          padding: 24,
        });
        gsap.to(panelcloseRef.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0%",
          padding: 0,
        });
        gsap.to(panelcloseRef.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen]
  );

  //for vehicle panel
  useGSAP(
    function () {
      if (vehiclePanel) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanel]
  );

  //for vehicle panel
  useGSAP(
    function () {
      if (confirmRidePanel) {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePanel]
  );

  //for vehicle Found
  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound]
  );

  //for waiting for Driver
  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver]
  );

  async function findTrip() {
    try {
        if (!pickup || !destination) {
            return alert("Please enter both pickup and destination.");
        }

        setVehiclePanel(true);
        setPanelOpen(false);

        console.log("Sending request with:", { pickup, destination });

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { 
                pickup, 
                destination
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        console.log("Fare Response:", response.data);
        setFare(response.data);
    } catch (error) {
        console.error("Error fetching fare:", error.response?.data || error.message);
        alert(`Error fetching fare: ${error.response?.data?.message || "Something went wrong."}`);
    }
}



  async function createRide() {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
        pickup,
        destination,
        vehicleType
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })


}


  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 abslute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />
      <div className="h-screen w-screen">
        {/* temprory imag */}
         {/* <LiveTracking/> */}
      </div>

      <div className="flex flex-col justify-end absolute h-screen w-full top-0 ">
        <div className="h-[30%] p-5 bg-white relative">
          <h5
            ref={panelcloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute opacity-0 top-6 right-6 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold ">Find a trip</h4>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className=" line absolute h-16 w-1 top-[45%] left-10 bg-gray-700 rounded-full">
            </div>

            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField('pickup');
              }}
              value={pickup}
              onChange={handlePickupChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
              type="text"
              placeholder="Add a pick-up location"
            />
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              value={destination}
              onChange={handleDestinationChange}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3"
              type="text"
              placeholder="Enter your destination"
            />
          </form>
          <button
            onClick={findTrip}
            className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
          >
            Find Trip
          </button>
        </div>


        <div ref={panelRef} className="h-0 bg-white  ">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>
      </div>
      <div
        ref={vehiclePanelRef}
        className=" fixed w-full translate-y-full  z-10 bottom-0 bg-white px-3 py-6 pt-12"
      >
        <VehiclePanel
         setVehicleType={setVehicleType}
      
        fare={fare}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
         
        />
      </div>
      <div
        ref={confirmRidePanelRef}
        className=" fixed w-full translate-y-full  z-10 bottom-0 bg-white px-3 py-6 pt-12"
      >
        <ConfirmRide
          pickup={pickup}
          fare={fare}
          destination= {destination}
          createRide={createRide}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
          setConfirmRidePanel={setConfirmRidePanel}
          
        />
      </div>
      <div
        ref={vehicleFoundRef}
        className=" fixed w-full translate-y-full  z-10 bottom-0 bg-white px-3 py-6 pt-12"
      >
        <LookingForDriver
                  pickup={pickup}
                  fare={fare}
                  destination= {destination}
                  createRide={createRide}
                  vehicleType={vehicleType}
        
        setVehicleFound={setVehicleFound} />
      </div>
      <div
        ref={waitingForDriverRef}
        className=" fixed w-full translate-y-full  z-10 bottom-0 bg-white px-3 py-6 pt-12"
      >
        <WaitingForDriver
        ride= {ride}
        setVehicleFound={setVehicleFound}
        waitingForDriver={waitingForDriver}
        setWaitingForDriver={setWaitingForDriver} />
      </div>
    </div>
  );
};

export default Home;
