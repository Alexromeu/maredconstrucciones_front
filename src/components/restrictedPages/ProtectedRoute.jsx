import { useAuth } from "../../contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  const isAdminArea = location.pathname.startsWith("/admin");
  const loginPath = isAdminArea ? "/admin/login" : "/signin";

  if (!user) {
    return <Navigate to={loginPath} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role_id)) {
    const fallback = user.role_id === 3 ? "/my-account" : "/";
    return <Navigate to={fallback} replace />;
  }

  return children ?? <Outlet />;
}
