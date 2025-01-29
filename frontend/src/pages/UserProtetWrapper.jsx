import React, { useContext, useEffect, useState }  from 'react'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'

const UserProtetWrapper = ({
    children
}) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const {user, setUser}= useContext(UserDataContext);
    const [isLoading, setIsLoading] = useState(true);

    console.log(token)

    useEffect(() => {
      //if token is not present
    if(!token){
      navigate('/login')
        }

    //if token present
    axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
      headers:{
        Authorization: `Bearere ${token}`
      }
    }).then(response =>{
      if(response.status==200){
        setUser(response.data.user);
        setIsLoading(false)
      }
    }).catch(e =>{
      localStorage.removeItem('token');
      navigate('/login')
    })
    }, [token]);

    if(isLoading){
      <div>isLoading......</div>
    }

  return (

    <>
        {children}
    </>
  )
}

export default UserProtetWrapper
