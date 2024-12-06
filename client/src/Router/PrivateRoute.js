import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

const PrivateRoute = ({ Component }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      // User is present in localStorage, so redirect to /home
      navigate("/login");
    }
  });
  return (
    <div>
      <Component />
    </div>
  );
};

export default PrivateRoute;
