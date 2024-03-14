import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const authToken = useSelector((state) => state.authToken.token);
  return authToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;