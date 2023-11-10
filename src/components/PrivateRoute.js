import React from "react";
import { Navigate } from "react-router-dom";
import { selectUser } from "@store/userSlice";
import { useSelector } from "react-redux";

export default function PrivateRoute({ children }) {
  const user = useSelector(selectUser);

  return user ? children : <Navigate to="/login" />;
}
