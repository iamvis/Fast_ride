import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'



const CaptainSignup = () => {
  const navigate = useNavigate();
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [color, setColor] = useState('');
  const [plate, setPlate] = useState('');
  const [vehicletype, setVehicleType] = useState('');
  const [capacity, setCapacity] = useState('');
  

 

  const { captain , setCaptain}= useContext(CaptainDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    const newCaptain = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password,
      vehicle:{
        color:color,
        plate:plate,
        capacity:capacity,
        vehicletype: vehicletype
      }
    }


//data posting

const response =  await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, newCaptain)

if(response.status ===201){
  const data = response.data
  localStorage.setItem('token', data.token);
  setCaptain(data.captain)
  navigate('/captain-home')
}
    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')
    setCapacity('')
    setColor('')
    setVehicleType('')
    setPlate('')

  }
  return (
    <div>
      <div className='p-7 h-screen flex flex-col justify-between'>
        <div>
          <img className='w-20 mb-5' src="https://pngimg.com/d/uber_PNG24.png"  alt="" />

          <form onSubmit={(e) => {
            submitHandler(e)
          }}>

            <h3 className='text-lg w-1/2  font-medium mb-2'>What's your name</h3>
            <div className='flex gap-4 mb-7'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='First name'
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                }}
              />
              <input
                required
                className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='Last name'
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                }}
              />
            </div>

            <h3 className='text-lg font-medium mb-2'>What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              type="email"
              placeholder='email@example.com'
            />

            <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

            <input
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              required type="password"
              placeholder='password'
            />
             <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
             <div className='flex gap-4 mb-7'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='Vehicle Color'
                value={color}
                onChange={(e) => {
                  setColor(e.target.value)
                }}
              />
              <input
                required
                className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='Vehicle Plate'
                value={plate}
                onChange={(e) => {
                  setPlate(e.target.value)
                }}
              />
            </div>
            <div className='flex gap-4 mb-7'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="number"
                placeholder=' Vehicle Capacity'
                value={capacity}
                onChange={(e) => {
                  setCapacity(e.target.value)
                }}
              />
              <select
                required
                className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                placeholder='Vehcle Type'
                value={vehicletype}
                onChange={(e) => {
                  setVehicleType(e.target.value)
                }} >
                <option value="" disabled> Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="auto" >Auto</option>
                <option value="MoterCycle">MotorCycle</option>
            </select>
            </div>

            <button
              className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
            >Create account</button>

          </form>
          <p className='text-center'>Already have a account ? <Link to='/Captain-login' className='text-blue-600'>Login here</Link></p>
        </div>
        <div>
          <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
            Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
        </div>
      </div>
    </div >
  )
}

export default CaptainSignup;