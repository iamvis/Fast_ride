import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';


const CaptainProtectWrapper = ({
    children
}) => {
    //get token from localstorage
    const token = localStorage.getItem('token');
    //for navigation
    const nevigate= useNavigate()
    
    //usedatacontext
    const {captain, setCaptain}= useContext(CaptainDataContext);
    //for ferther checking
     const [isLoading, setIsLoading] = useState(true);
     
    console.log(token)
    
    
    useEffect(()=>{
        //if token not present
    if(!token){
        nevigate('/captain-login')
    }

    //if token present
    //token bheja cheking k liye
    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(response =>{
        if(response.status ===200){
            setCaptain(response.data.captain)
            setIsLoading(false)
        }
    }).catch(e=>{
        localStorage.removeItem('token');
        nevigate('/captain-login')
    })

},[token])

if(isLoading){
    return (
        <div>isLoading......</div>
    )
}

    return (
    <>
      {children}
    </>
  )
}

export default CaptainProtectWrapper
