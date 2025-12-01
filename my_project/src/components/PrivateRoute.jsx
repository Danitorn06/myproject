import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

// children: หน้า component ที่ต้องการ render
// roleRequired: 'admin' หรือ 'user' (ไม่ใส่=แค่ต้อง login)
const PrivateRoute = ({ children, roleRequired }) => {
  const token = Cookies.get("token");
  const role = Cookies.get("role");

  if (!token) {
    // ยังไม่ได้ login → ไปหน้า login
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && role !== roleRequired) {
    // login แต่ role ไม่ตรง → ไปหน้า home หรือหน้า public
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
