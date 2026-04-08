import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';
import LoaderScreen from '../components/LoaderScreen';
import { clearCaptainToken, getCaptainToken } from '../utils/authStorage';

const CaptainProtectWrapper = ({ children }) => {
    const token = getCaptainToken();
    const navigate = useNavigate();
    const { setCaptain } = useContext(CaptainDataContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/captain-login');
            return;
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setCaptain(response.data);
                setIsLoading(false);
            }
        }).catch(() => {
            clearCaptainToken();
            navigate('/captain-login');
        });
    }, [navigate, setCaptain, token]);

    if (isLoading) {
        return <LoaderScreen title="Checking captain session" subtitle="Preparing your queue, live status, and active ride controls." />;
    }

    return <>{children}</>;
}

export default CaptainProtectWrapper
