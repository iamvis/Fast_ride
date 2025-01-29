import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { CaptainDataContext } from '../context/CaptainContext';


const CaptainLogin = () => {
    //to way binding to React component
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captainData, setCaptainData] = useState({});
    const navigate = useNavigate();
    const {captain, setCaptain} = useContext(CaptainDataContext)

    const submitHandler = async (e)=>{
           e.preventDefault();
          const captainData = {
            email:email,
            password:password
          }

          const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captainData)
          if(response==200){
            const data = response.data;
            setCaptain(data.captain);
            localStorage.setItem('token', data.token)
            navigate('/captain-home')
          }
           setEmail('')
           setPassword('')
           
  
    }
  return (
    <div className="p-7 h-screen justify-between flex flex-col">
      <div>
      <img className="w-20 mb-5" src="https://pngimg.com/d/uber_PNG24.png" />
      <form onSubmit={(e)=>{submitHandler(e)}} >
        <h3 className="text-lg font-medium mb-2 ">What's your email</h3>
        <input 
        required 
        value={email}
        onChange={(e)=>{
         setEmail(e.target.value)  
        }}
        type="email"
        placeholder='email@example.com'
        className="bg-[#eeeeee] rounded mb-7 px-4 py-2 border text-lg w-full placeholder:text-base "
         />
        <h3 className="text-lg font-medium mb-2">Enter your Password</h3>
        <input 
        required 
        value={password}
        onChange={(e)=>{
         setPassword(e.target.value)  
        }}
        type="password"
        placeholder='Enter your password'
        className="bg-[#eeeeee] rounded mb-7 px-4 py-2 border text-lg w-full placeholder:text-base"
         />
         <button 
         className="flex flex-col items-center text-white bg-black mb-2 px-4 py-2 rounded text-lg font-semibold w-full">Login</button>
         
      </form>
      <p className="text-center">New here? <Link to='/captain-signup' className="text-blue-600 font-medium">Register as Captain</Link></p>
      </div>
      <div>
        
      <Link
      to='/login'
         className="flex flex-col justify-center items-center text-white bg-orange-600 mb-7 px-4 py-2 font-semibold rounded text-lg w-full">Sign in as User</Link>
      </div>
    </div>
  )
}

export default CaptainLogin