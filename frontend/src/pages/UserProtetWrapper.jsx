import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import LoaderScreen from "../components/LoaderScreen";
import { clearUserToken, getUserToken } from "../utils/authStorage";

const UserProtectWrapper = ({ children }) => {
  const token = getUserToken();
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        clearUserToken();
        navigate("/login");
      });
  }, [navigate, setUser, token]);

  if (isLoading) {
    return <LoaderScreen title="Checking rider session" subtitle="We are making sure your ride history and booking tools are ready." />;
  }

  return <>{children}</>;
};

export default UserProtectWrapper;
