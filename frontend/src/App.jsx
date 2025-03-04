import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import Login from "./components/Login";
import StudentPortal from "./components/StudentPortal";
import MentorPortal from "./components/MentorPortal";
import AdminPortal from "./components/AdminPortal";
import Home from "./components/Home";
import Unauthorized from "./components/NotFound";

import RoleBasedRoute from "./RoleBasedRoute";

import "./App.css";

// export default function App() {
//   return <Home />;
// }

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/dev" element={
            <RoleBasedRoute allowedRoles={["dev"]}>
              <Home/>
            </RoleBasedRoute>
          } />

          <Route
            path="/home"
            element={
              <RoleBasedRoute allowedRoles={["student"]}>
                <StudentPortal />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/mentor/home"
            element={
              <RoleBasedRoute allowedRoles={["mentor"]}>
                <MentorPortal />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/home"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminPortal />
              </RoleBasedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/unauthorized" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
