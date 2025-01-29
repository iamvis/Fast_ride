import React, { useContext, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import  { UserDataContext } from '../context/UserContext';

const UserLogin = () => {
  //to way binding to React component
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState({});

  // to use navigate
  const navigate = useNavigate();

  //d structuring data from the user constext
  const {user, setUser}= useContext(UserDataContext)

  const submitHandler = async (e)=>{
         e.preventDefault();
       const  userData= {
        email:email,
        password:password
      }

        //data [posting for usr]
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)
        if(response.status== 200){
          const data = response.data 
          localStorage.setItem('token', data.token)
          setUser(data.user)

          navigate('/home')
        }        
         setEmail('')
          setPassword('')

  }


  return (
    <div className="p-7 h-screen justify-between flex flex-col">
      <div>
      <img className="w-16 mb-10" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" />
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
      <p className="text-center">New here? <Link to='/signup' className="text-blue-600 font-medium">Create a Account</Link></p>
      </div>
      <div>
        
      <Link
      to='/captain-login'
         className="flex flex-col justify-center items-center text-white bg-green-600 mb-7 px-4 py-2 font-semibold rounded text-lg w-full">Sign in as Captain</Link>
      </div>
    </div>
  )
}

export default UserLogin