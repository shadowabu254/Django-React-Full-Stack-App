import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import api from "../api";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);
  const RefreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };
  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const expiration = decoded.exp;
    const now = Date.now() / 1000;
    if (expiration < now) {
      await RefreshToken();
    } else {
      setIsAuthorized(true);
    }
  };
  if (isAuthorized == null) {
    return <div>Loading...</div>;
  }
  return isAuthorized ? children : <Navigate to="/login" />;
}
export default ProtectedRoute;
