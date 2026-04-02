import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // Not logged in
  if (!user || !user.token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Not admin
    // if (user.role_id !== 1) {
    //     return <Navigate to="/" replace />;
    // }

  return children;
}
