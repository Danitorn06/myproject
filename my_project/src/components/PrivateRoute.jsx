import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ children, roleRequired }) => {
  const token = Cookies.get("token");
  const role = Cookies.get("role");

  if (!token || role !== roleRequired) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
