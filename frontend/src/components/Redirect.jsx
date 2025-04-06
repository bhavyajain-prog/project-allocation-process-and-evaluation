import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Redirect() {
  const { user } = useAuth();
  console.log("Redirecting for user:", user);

  if (!user) return null; // Let loading screen handle this

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin/home" />;
    case "student":
      return <Navigate to="/home" />;
    case "mentor":
      return <Navigate to="/mentor/home" />;
    case "dev":
      return <Navigate to="/dev" />;
    default:
      console.warn("Unknown role, redirecting to notfound");
      return <Navigate to="/notfound" />;
  }
}
