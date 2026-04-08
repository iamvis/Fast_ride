import React, { createContext, useState } from 'react';

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
    const [captain, setCaptain] = useState({
        fullname: {
            firstname: '',
            lastname: ''
        },
        vehicle: {
            color: '',
            plate: '',
            capacity: '',
            vehicletype: ''
        }
    });

    return (
        <CaptainDataContext.Provider value={{ captain, setCaptain }}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainContext;
