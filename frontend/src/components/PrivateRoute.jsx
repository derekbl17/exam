import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

const PrivateRoute = ({ allowed }) => {
  const { user } = useAuth();

  if (!user) {
    console.log("no user info");
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(user.role)) {
    return <Navigate to="/no-auth" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
