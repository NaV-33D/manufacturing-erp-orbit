import React from "react";
import { Navigate, useLocation } from "react-router";
import { getToken } from "./authStorage";

const RequireAuth = ({ children }) => {
  const token = getToken();
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          reason: "Session expired or not logged in.",
        }}
      />
    );
  }

  return children;
};

export default RequireAuth;
