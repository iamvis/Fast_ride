import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const UserLogout = () => {
    //take token
    const token = localStorage.getItem('token');
    //for navigation
    const navigate = useNavigate();
    //token checking
    axios.get(`${import.meta.env.VITE_BASE_URL}/usrs/logout`,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    }).then((response) =>{
        if(response.status==200){
            localStorage.removeItem('token')
            navigate('/login')
        }
    })
  return (
    <div>
      UserLogout...
    </div>
  )
}

export default UserLogout
