
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  role?: "user" | "admin";
}

const ProtectedRoute = ({ role = "user" }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-campus-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role check fails, redirect to appropriate page
  if (role === "admin" && user.role !== "admin") {
    return <Navigate to="/book" replace />;
  }

  // All checks passed, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
