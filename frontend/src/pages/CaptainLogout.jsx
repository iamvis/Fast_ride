import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoaderScreen from '../components/LoaderScreen';
import { clearCaptainToken, getCaptainToken } from '../utils/authStorage';

const CaptainLogout = () => {
    const token = getCaptainToken();
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } catch {
            } finally {
                clearCaptainToken();
                navigate('/captain-login');
            }
        };

        logout();
    }, [navigate, token]);

    return <LoaderScreen title="Signing captain out" subtitle="Wrapping up the current session and returning to captain login." />;
}

export default CaptainLogout
