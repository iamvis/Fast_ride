# /users/register Endpoint Documentation

## **Description**
The `/users/register` endpoint is used to register a new user in the system. It accepts user details such as their first name, last name, email, and password, validates the input, hashes the password, and creates the user in the database. Upon successful registration, it generates a token and returns it along with the created user's information.

---

## **Endpoint**
**URL:** `/users/register`  
**Method:** `POST`

---

## **Request Body**
The following fields must be included in the request body:

### **Required Fields**
| Field                   | Type     | Description                              |
|-------------------------|----------|------------------------------------------|
| `fullname.firstname`    | `string` | User's first name (minimum 3 characters).|
| `fullname.lastname`     | `string` | User's last name (optional).             |
| `email`                 | `string` | User's valid email address.              |
| `password`              | `string` | User's password (minimum 6 characters).  |

#### **Example Request**
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

---

## **Validation Rules**
- `fullname.firstname`: Must be at least 3 characters long.
- `email`: Must be a valid email address.
- `password`: Must be at least 6 characters long.

If any validation fails, a `400 Bad Request` response is returned with the validation errors.

---

## **Responses**

### **Success Response**
| Status Code | Description                    |
|-------------|--------------------------------|
| `201`       | User created successfully.     |

#### Example Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "63a1234567890abc12345def",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### **Error Responses**
| Status Code | Description                             |
|-------------|-----------------------------------------|
| `400`       | Validation failed with error details.   |
| `500`       | Internal server error.                 |

#### Example Validation Error Response:
```json
{
  "errors": [
    { "msg": "firstname is required at least 3 characters", "param": "fullname.firstname" },
    { "msg": "Invalid email", "param": "email" }
  ]
}
```

---

## **Internal Logic Overview**
1. **Validation:**
   - Input data is validated using `express-validator`.
   - If validation fails, a `400` error with detailed messages is returned.

2. **Password Hashing:**
   - The password is securely hashed before being saved.

3. **User Creation:**
   - A new user is created in the database using the `createUser` service.

4. **Token Generation:**
   - A JWT token is generated for the user.

---

## **Setup Instructions**
Ensure the following:
- The `JWT_SECRET` is configured in your environment variables.
- Required dependencies (`express`, `express-validator`, `bcrypt`, etc.) are installed.

---

## **Dependencies**
- `express`
- `express-validator`
- `bcrypt`
- `jsonwebtoken`
- `mongoose`

# /users/login Endpoint Documentation

## Description
The `/users/login` endpoint allows users to log in by providing their email and password. It validates the input data and returns an authentication token if the login is successful.

---

## Endpoint
`POST /users/login`

---

## Request

### Headers
- `Content-Type: application/json`

### Body (JSON)
The request body must include the following fields:

| Field    | Type   | Required | Description                     |
|----------|--------|----------|---------------------------------|
| `email`  | String | Yes      | The user's email address.       |
| `password`| String| Yes      | The user's password (min. 6).   |

#### Example Request Body:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

---

## Response

### Success Response
- **Status Code:** `200 OK`
- **Content:** JSON object containing the authentication token and user data.

#### Example:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64d43ebf5e6a",
    "email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe"
  }
}
```

### Error Responses

| Status Code | Description                         |
|-------------|-------------------------------------|
| `400`       | Validation errors in input fields.  |
| `401`       | Invalid email or password.          |

#### Example Error Responses:
1. **Validation Error (400):**
   ```json
   {
     "errors": [
       {
         "msg": "Invalid Email",
         "param": "email",
         "location": "body"
       }
     ]
   }
   ```

2. **Authentication Failure (401):**
   ```json
   {
     "message": "Invalid Email or Password"
   }
   ```

---

## Implementation Details

### Validation
The following validations are performed on the request body:
1. `email` must be a valid email address.
2. `password` must be at least 6 characters long.

### Logic
1. Validate the input using `express-validator`.
2. Check if a user with the provided email exists in the database.
3. If the user exists, compare the provided password with the stored (hashed) password.
4. If the password matches, generate and return a JWT token along with user details.
5. If any step fails, return the appropriate error response.

---

## Files
This endpoint is implemented in the following files:
- **Route Definition:** `routes/user.route.js`
- **Controller Logic:** `controllers/user.controller.js`
- **Model Definition:** `models/user.model.js`

---

## Notes
- The endpoint requires the password field to be explicitly included in the query using `.select('+password')`.
- Password comparison is done using a method like `comparePassword` defined in the user model.

# /users/profile Endpoint Documentation

## **Description**
This document outlines the details for the `/users/profile` endpoint.

---

## **/users/profile**

### **URL**: `/users/profile`  
### **Method**: `GET`

### **Description**:
The `/users/profile` endpoint retrieves the profile information of the authenticated user.

### **Headers**
| Header            | Type     | Description                              |
|-------------------|----------|------------------------------------------|
| `Authorization`   | `string` | Bearer token or token in cookies.       |

### **Validation**:
Authentication is required using the token in the request headers or cookies.

### **Success Response**:
| Status Code | Description               |
|-------------|---------------------------|
| `200`       | User profile retrieved.   |

#### Example Response:
```json
{
  "_id": "63a1234567890abc12345def",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com"
}
```

### **Error Response**:
| Status Code | Description                  |
|-------------|------------------------------|
| `401`       | Unauthorized or token invalid. |

#### Example Error Response:
```json
{
  "message": "Unauthorized"
}
```

---

## **Internal Logic Overview**
- The token is extracted from cookies or the `Authorization` header.
- The token is verified, and the corresponding user is fetched from the database.
- The middleware `authUser` ensures only authenticated users can access this endpoint.

---

## **Setup Instructions**
Ensure the following:
- The `JWT_SECRET` is configured in your environment variables.
- Required dependencies (`express`, `jsonwebtoken`, `mongoose`, etc.) are installed.

---

## **Dependencies**
- `express`
- `jsonwebtoken`
- `mongoose`
- `cookie-parser` (for managing cookies)


# /users/logout Endpoint Documentation

## **Overview**
The `/users/logout` endpoint allows authenticated users to log out by clearing their session token from cookies and blacklisting it to prevent further use.

---

## **Endpoint Details**

### **URL**: `/users/logout`
### **Method**: `GET`

### **Headers**
| Header            | Type     | Description                              |
|-------------------|----------|------------------------------------------|
| `Authorization`   | `string` | Bearer token (optional if using cookies).|

### **Authentication**
- A valid token is required, either from cookies or passed as a Bearer token in the `Authorization` header.

### **Success Response**:
| Status Code | Description                  |
|-------------|------------------------------|
| `200`       | User successfully logged out.|

#### **Example Response**:
```json
{
  "message": "Logged out"
}
```

### **Error Responses**:
| Status Code | Description                       |
|-------------|-----------------------------------|
| `401`       | Unauthorized or invalid token.    |

#### **Example Error Response**:
```json
{
  "message": "Unauthorized"
}
```

---

## **Implementation Details**

1. **Clearing Cookies**:
   - The token is removed from the user's cookies, effectively ending their session.

2. **Blacklisting Tokens**:
   - The token is added to a `BlacklistToken` collection in the database.
   - Blacklisted tokens are automatically expired after 24 hours.

3. **Middleware**:
   - The `authUser` middleware validates the user’s token before allowing access to the endpoint.

---

## **Setup Requirements**
To use this endpoint:
- Ensure `JWT_SECRET` is defined in your environment variables.
- Install the following dependencies:
  - `express` for handling HTTP requests.
  - `jsonwebtoken` for token generation and verification.
  - `mongoose` for database interaction.
  - `cookie-parser` for managing cookies.
- Implement the `BlacklistToken` schema in the database to store blacklisted tokens:

```javascript
const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // 24 hours in seconds
    }
});

module.exports = mongoose.model('BlacklistToken', blacklistTokenSchema);
```

---

# /captains/register Endpoint Documentation

## **Overview**
The `/captain/register` endpoint allows new captains to register by providing their personal and vehicle information. Validation is enforced to ensure the data meets the required criteria.

---

## **Endpoint Details**

### **URL**: `/captain/register`
### **Method**: `POST`

---

## **Request Requirements**

### **Headers**
| Header            | Type     | Description                              |
|-------------------|----------|------------------------------------------|
| `Content-Type`    | `string` | Must be `application/json`.             |

### **Request Body**
The request body must be in JSON format and include the following fields:

| Field                     | Type     | Required | Validation                                     |
|---------------------------|----------|----------|------------------------------------------------|
| `fullname.firstname`      | `string` | Yes      | Minimum 3 characters.                         |
| `fullname.lastname`       | `string` | No       | Minimum 3 characters.                         |
| `email`                   | `string` | Yes      | Must be a valid email format.                 |
| `password`                | `string` | Yes      | Minimum 6 characters.                         |
| `vehicle.color`           | `string` | Yes      | Minimum 3 characters.                         |
| `vehicle.plate`           | `string` | Yes      | Minimum 4 characters.                         |
| `vehicle.capacity`        | `number` | Yes      | Must be at least 1.                           |
| `vehicle.vehicletype`     | `string` | Yes      | Must be one of: `car`, `motorcycle`, `auto`.  |

#### **Example Request Body**
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Blue",
    "plate": "XYZ1234",
    "capacity": 4,
    "vehicletype": "car"
  }
}
```

---

## **Response Details**

### **Success Response**:
| Status Code | Description                  |
|-------------|------------------------------|
| `201`       | Captain registered successfully. |

#### **Example Success Response**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "vehicle": {
      "color": "Blue",
      "plate": "XYZ1234",
      "capacity": 4,
      "vehicletype": "car"
    },
    "status": "inactive"
  }
}
```

### **Error Responses**:
| Status Code | Description                      |
|-------------|----------------------------------|
| `400`       | Validation error or missing data. |
| `400`       | Captain already exists.           |

#### **Example Error Response** (Validation Error)
```json
{
  "errors": [
    {
      "msg": "Email is invalid",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### **Example Error Response** (Captain Exists)
```json
{
  "message": "Captain already exists"
}
```

---

## **Implementation Details**
1. **Validation**:
   - Express-validator is used to validate the incoming data.
   - Ensures that all required fields are present and meet the criteria.

2. **Password Handling**:
   - The password is hashed using `bcrypt` before storing it in the database.

3. **Token Generation**:
   - A JWT token is generated upon successful registration for authentication.

4. **Error Handling**:
   - Provides detailed error messages for validation failures and duplicate registrations.

---

## **Dependencies**
- `express`
- `express-validator`
- `mongoose`
- `bcrypt`
- `jsonwebtoken`

---

## **Setup Instructions**
Ensure the following:
- The `JWT_SECRET` environment variable is configured.
- Required dependencies are installed.
- A valid MongoDB connection is established.


# API Documentation for Captain Endpoints

## /captain/login
### Description
This endpoint allows a captain to log in using their email and password.

### HTTP Method
POST

### Request Body
```json
{
  "email": "captain@example.com",
  "password": "password123"
}
```

### Validation Rules
- `email`: Must be a valid email address.
- `password`: Must be at least 6 characters long.

### Response
- **200 OK**: Successfully authenticated. Returns a token and captain details.
```json
{
  "token": "<JWT_TOKEN>",
  "captain": {
    "id": "<CAPTAIN_ID>",
    "email": "captain@example.com",
    "firstname": "John",
    "lastname": "Doe"
  }
}
```
- **400 Bad Request**: Invalid email or password.
```json
{
  "message": "Invalid Email or Password"
}
```
- **400 Bad Request**: Validation errors.
```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Headers
- **Authorization**: Not required.

### Cookies
- Sets a `token` cookie upon successful login.

---


#  Profile Endpoints

## /captain/profile
### Description
This endpoint retrieves the authenticated captain's profile information.

### HTTP Method
GET

### Headers
- **Authorization**: Required. The JWT token must be included in the `Authorization` header in the format:
  ```
  Bearer <JWT_TOKEN>
  ```

### Response
- **200 OK**: Returns the captain's profile details.
```json
{
  "id": "<CAPTAIN_ID>",
  "email": "captain@example.com",
  "firstname": "John",
  "lastname": "Doe",
  "vehicle": {
    "color": "Blue",
    "plate": "ABC1234",
    "vehicletype": "car",
    "capacity": 4
  }
}
```
- **401 Unauthorized**: If the token is missing, invalid, or expired.
```json
{
  "message": "Unauthorized"
}
```

### Cookies
- The `token` cookie can also be used for authentication if present.

---

#  Logout Endpoints

## /captain/logout
### Description
This endpoint logs out the authenticated captain by invalidating their token.

### HTTP Method
GET

### Headers
- **Authorization**: Required. The JWT token must be included in the `Authorization` header in the format:
  ```
  Bearer <JWT_TOKEN>
  ```

### Response
- **200 OK**: Successfully logged out.
```json
{
  "message": "Logged out"
}
```
- **401 Unauthorized**: If the token is missing, invalid, or expired.
```json
{
  "message": "Unauthorized"
}
```

### Cookies
- Clears the `token` cookie upon logout.

---


# Ride Booking API

This API allows users to book rides, get fare estimates, and manage ride statuses.

## Features
- Create a ride request
- Get fare estimates based on distance and vehicle type
- Authenticate users before booking rides
- Generate OTP for ride verification
- Accept or cancel ride requests (Captain)
- Complete ride transactions
- Handle payment processing and verification

## Technologies Used
- Node.js
- Express.js
- MongoDB with Mongoose
- Google Maps API (for distance and time calculations)
- JWT for authentication

## Endpoints

### Create Ride
**POST** `/ride/create`

#### Request Body
```json
{
  "pickup": "string (min: 3 characters)",
  "destination": "string (min: 3 characters)",
  "vehicleType": "string (auto | car | moto)"
}
```

#### Response
```json
{
  "_id": "rideId",
  "user": "userId",
  "pickup": "pickupLocation",
  "destination": "destinationLocation",
  "fare": 50,
  "otp": "123456",
  "status": "pending"
}
```

### Get Fare Estimate
**GET** `/ride/get-fare`

#### Query Parameters
- `pickup` (string, required)
- `destination` (string, required)

#### Response
```json
{
  "auto": 40,
  "car": 70,
  "moto": 30
}
```

### Accept Ride (Captain)
**POST** `/ride/accept`

#### Request Body
```json
{
  "rideId": "string (ride ID)",
  "captainId": "string (captain ID)"
}
```

#### Response
```json
{
  "_id": "rideId",
  "status": "accepted",
  "captain": "captainId"
}
```

### Cancel Ride
**POST** `/ride/cancel`

#### Request Body
```json
{
  "rideId": "string (ride ID)",
  "userId": "string (user ID)"
}
```

#### Response
```json
{
  "_id": "rideId",
  "status": "cancelled"
}
```

### Complete Ride
**POST** `/ride/complete`

#### Request Body
```json
{
  "rideId": "string (ride ID)",
  "captainId": "string (captain ID)"
}
```

#### Response
```json
{
  "_id": "rideId",
  "status": "completed"
}
```

### Initiate Payment
**POST** `/payment/initiate`

#### Request Body
```json
{
  "rideId": "string (ride ID)",
  "userId": "string (user ID)",
  "amount": "number"
}
```

#### Response
```json
{
  "orderId": "orderId",
  "paymentLink": "paymentGatewayURL"
}
```

### Verify Payment
**POST** `/payment/verify`

#### Request Body
```json
{
  "orderId": "string (order ID)",
  "paymentID": "string (payment ID)",
  "signature": "string (payment signature)"
}
```

#### Response
```json
{
  "status": "success",
  "rideId": "rideId"
}
```

## Ride Schema
- `user`: ObjectId (Reference to user)
- `captain`: ObjectId (Reference to captain, optional)
- `pickup`: String (Required)
- `destination`: String (Required)
- `fare`: Number (Required)
- `status`: Enum (pending, accepted, ongoing, completed, cancelled) (Default: pending)
- `duration`: Number (Seconds)
- `distance`: Number (Meters)
- `paymentID`, `orderId`, `signature`: Strings (For payment verification)
- `otp`: String (6-digit, Required, Not exposed in response)

## How Fare is Calculated
Fare is based on:
- Base Fare: (Auto: 30, Car: 50, Moto: 20)
- Per km rate: (Auto: 10, Car: 15, Moto: 8)
- Per minute rate: (Auto: 2, Car: 3, Moto: 1.5)
- Distance and duration are fetched using Google Maps API

## Authentication
- `authMiddleware.authUser` ensures only logged-in users can create a ride or get fare estimates.
- `authMiddleware.authCaptain` ensures only captains can accept and complete rides.
- JWT tokens are used for user and captain authentication.

## OTP Generation
- OTP is generated using `crypto.randomInt` and stored securely.

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Setup `.env` file with MongoDB and API keys
4. Start server: `npm start`

### Example `.env` File
```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
PAYMENT_GATEWAY_KEY=your_payment_gateway_key
```

---

This README provides an overview of the ride booking API. Let me know if you need further modifications!


