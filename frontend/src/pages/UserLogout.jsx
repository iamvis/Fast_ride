import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoaderScreen from '../components/LoaderScreen';
import { clearUserToken, getUserToken } from '../utils/authStorage';

const UserLogout = () => {
    const token = getUserToken();
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } catch {
            } finally {
                clearUserToken();
                navigate('/login');
            }
        };

        logout();
    }, [navigate, token]);

    return <LoaderScreen title="Signing you out" subtitle="Clearing your rider session and taking you back to login." />;
}

export default UserLogout
