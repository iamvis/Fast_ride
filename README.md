# Fastride

Fastride is a full-stack ride-booking application with separate rider and captain flows, live ride updates over sockets, trip lifecycle management, and Razorpay payment support after trip completion.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, GSAP, Socket.IO client, MapLibre
- Backend: Node.js, Express, MongoDB, Mongoose, Socket.IO
- Payments: Razorpay

## Project Structure

- `frontend/` - React app
- `backend/` - Express API and socket server

## Main Features

- rider signup/login/logout
- captain signup/login/logout
- fare estimation
- ride creation and captain matching
- OTP-based ride start
- live ride state updates
- ride completion
- Razorpay order creation and payment verification
- Razorpay webhook support for reliable payment confirmation

## Local Setup

### 1. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### 2. Configure environment

Create `backend/.env`:

```env
PORT=5000
DB_CONNECT=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
HERE_API_KEY=your_here_api_key
OPENROUTESERVICE_API_KEY=your_openrouteservice_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

Create `frontend/.env`:

```env
VITE_BASE_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Run the app

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

## API Overview

### User routes

- `POST /users/register`
- `POST /users/login`
- `GET /users/profile`
- `GET /users/logout`

### Captain routes

- `POST /captains/register`
- `POST /captains/login`
- `GET /captains/profile`
- `GET /captains/logout`

### Ride routes

- `POST /rides/create`
- `GET /rides/get-fare`
- `POST /rides/confirm`
- `GET /rides/start-ride`
- `POST /rides/end-ride`
- `POST /rides/payment-order`
- `POST /rides/verify-payment`
- `POST /rides/razorpay/webhook`

## Ride Flow

1. Rider gets fare estimate
2. Rider creates a ride
3. Captain receives ride request via socket
4. Captain confirms ride
5. Captain starts ride using OTP
6. Captain ends ride
7. Rider pays after ride completion

## Payment Notes

- payment is only available after ride completion
- backend verifies Razorpay signature and payment details
- webhook endpoint exists for recovery if frontend verification does not finish
- configure `payment.captured` webhook in Razorpay Dashboard

## Auth Notes

- rider and captain token storage is separated on the frontend
- backend rejects tokens for deleted or missing accounts
- blacklisted logout tokens are stored in MongoDB

## Frontend Optimization Notes

Recent optimizations:

- route-level lazy loading
- deferred loading for map screens
- vendor chunk splitting in Vite
- cleaner socket listener lifecycle

This improves initial app load and keeps heavy map code out of login/signup/startup screens.

## Deployment Checklist

- set backend environment variables
- set frontend environment variables
- use production MongoDB
- deploy backend on a public HTTPS URL
- point frontend `VITE_BASE_URL` to deployed backend
- configure Razorpay webhook URL:

```text
POST /rides/razorpay/webhook
```

- set the same `RAZORPAY_WEBHOOK_SECRET` in backend env and Razorpay Dashboard

## Verification Status

Verified locally:

- frontend production build passes
- backend auth and ride creation flow works
- rider and captain token collision issue was fixed
- Razorpay order and verification code paths are implemented

Still recommended before production launch:

- full live Razorpay payment test on deployed URLs
- webhook delivery test from Razorpay Dashboard
