const axios = require('./backend/node_modules/axios').default;
const { io } = require('./frontend/node_modules/socket.io-client/build/cjs');

const baseURL = 'http://localhost:5000';
const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

function waitForEvent(socket, eventName, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off(eventName, handler);
      reject(new Error(`Timed out waiting for ${eventName}`));
    }, timeoutMs);

    const handler = (payload) => {
      clearTimeout(timer);
      socket.off(eventName, handler);
      resolve(payload);
    };

    socket.on(eventName, handler);
  });
}

async function main() {
  const stamp = Date.now();
  const userEmail = `rider_${stamp}@example.com`;
  const captainEmail = `captain_${stamp}@example.com`;
  const password = 'secret123';
  const pickup = 'Indore Railway Station, Indore';
  const destination = 'Rajwada, Indore';

  const summary = {
    userEmail,
    captainEmail,
    stages: []
  };

  let userSocket;
  let captainSocket;

  try {
    const userRegister = await axios.post(`${baseURL}/users/register`, {
      fullname: { firstname: 'Rider', lastname: 'Flow' },
      email: userEmail,
      password,
    });
    const userToken = userRegister.data.token;
    const userId = userRegister.data.user._id;
    summary.stages.push({ stage: 'user_register', ok: true, userId });

    const captainRegister = await axios.post(`${baseURL}/captains/register`, {
      fullname: { firstname: 'Capta', lastname: 'Flow' },
      email: captainEmail,
      password,
      vehicle: {
        color: 'black',
        plate: `MP09${stamp.toString().slice(-4)}`,
        capacity: 4,
        vehicletype: 'car',
      }
    });
    const captainToken = captainRegister.data.token;
    const captainId = captainRegister.data.captain._id;
    summary.stages.push({ stage: 'captain_register', ok: true, captainId });

    const userProfile = await axios.get(`${baseURL}/users/profile`, { headers: authHeaders(userToken) });
    const captainProfile = await axios.get(`${baseURL}/captains/profile`, { headers: authHeaders(captainToken) });
    summary.stages.push({ stage: 'profiles', ok: userProfile.status === 200 && captainProfile.status === 200 });

    userSocket = io(baseURL, { transports: ['websocket'] });
    captainSocket = io(baseURL, { transports: ['websocket'] });

    await Promise.all([
      waitForEvent(userSocket, 'connect'),
      waitForEvent(captainSocket, 'connect')
    ]);

    userSocket.emit('join', { userType: 'user', userId });
    captainSocket.emit('join', { userType: 'captain', userId: captainId });
    summary.stages.push({ stage: 'socket_join', ok: true });

    const coordsResponse = await axios.get(`${baseURL}/maps/get-coordinates`, {
      params: { address: pickup },
      headers: authHeaders(userToken),
    });
    const pickupCoords = coordsResponse.data;
    captainSocket.emit('update-location-captain', {
      userId: captainId,
      location: pickupCoords,
    });
    await timeout(1200);
    summary.stages.push({ stage: 'captain_location_update', ok: true, pickupCoords });

    const fareResponse = await axios.get(`${baseURL}/rides/get-fare`, {
      params: { pickup, destination },
      headers: authHeaders(userToken),
    });
    summary.stages.push({ stage: 'fare_lookup', ok: fareResponse.status === 200, fare: fareResponse.data });

    const captainNewRidePromise = waitForEvent(captainSocket, 'new-ride', 20000);
    const rideCreateResponse = await axios.post(`${baseURL}/rides/create`, {
      pickup,
      destination,
      vehicleType: 'car',
    }, { headers: authHeaders(userToken) });
    const createdRide = rideCreateResponse.data;
    summary.stages.push({ stage: 'ride_create', ok: rideCreateResponse.status === 201, rideId: createdRide._id });

    const newRideEvent = await captainNewRidePromise;
    summary.stages.push({ stage: 'captain_new_ride_event', ok: !!newRideEvent?._id, eventRideId: newRideEvent?._id });

    const rideConfirmedPromise = waitForEvent(userSocket, 'ride-confirmed', 15000);
    const confirmResponse = await axios.post(`${baseURL}/rides/confirm`, {
      rideId: createdRide._id,
    }, { headers: authHeaders(captainToken) });
    const confirmedRide = confirmResponse.data;
    summary.stages.push({ stage: 'captain_confirm_ride', ok: confirmResponse.status === 200, otp: confirmedRide.otp });

    const rideConfirmedEvent = await rideConfirmedPromise;
    summary.stages.push({ stage: 'user_ride_confirmed_event', ok: rideConfirmedEvent?.status === 'accepted' });

    const rideStartedPromise = waitForEvent(userSocket, 'ride-started', 15000);
    const startResponse = await axios.get(`${baseURL}/rides/start-ride`, {
      params: { rideId: createdRide._id, otp: confirmedRide.otp },
      headers: authHeaders(captainToken),
    });
    summary.stages.push({ stage: 'captain_start_ride', ok: startResponse.status === 200 });

    const rideStartedEvent = await rideStartedPromise;
    summary.stages.push({ stage: 'user_ride_started_event', ok: rideStartedEvent?.status === 'accepted' || rideStartedEvent?.status === 'ongoing' });

    const rideEndedPromise = waitForEvent(userSocket, 'ride-ended', 15000);
    const endResponse = await axios.post(`${baseURL}/rides/end-ride`, {
      rideId: createdRide._id,
    }, { headers: authHeaders(captainToken) });
    summary.stages.push({ stage: 'captain_end_ride', ok: endResponse.status === 200 });

    const rideEndedEvent = await rideEndedPromise;
    summary.stages.push({ stage: 'user_ride_ended_event', ok: rideEndedEvent?.status === 'completed' || rideEndedEvent?.status === 'ongoing' });

    await axios.get(`${baseURL}/users/logout`, { headers: authHeaders(userToken) });
    await axios.get(`${baseURL}/captains/logout`, { headers: authHeaders(captainToken) });
    summary.stages.push({ stage: 'logout', ok: true });

    console.log(JSON.stringify({ ok: true, summary }, null, 2));
  } catch (error) {
    console.log(JSON.stringify({
      ok: false,
      error: error.message,
      response: error.response?.data,
      summary,
    }, null, 2));
    process.exitCode = 1;
  } finally {
    if (userSocket) userSocket.close();
    if (captainSocket) captainSocket.close();
  }
}

main();
