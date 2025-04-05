import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import Header from "./components/Header";
import Login from "./components/Login";
import StudentPortal from "./components/StudentPortal";
import MentorPortal from "./components/MentorPortal";
import AdminPortal from "./components/AdminPortal";
import Home from "./components/Home";
import Unauthorized from "./components/NotFound";
import Upload from "./components/AdminUpload";
import CreateTeam from "./components/CreateTeam";
import ForgotPassword from "./components/ForgotPassword";
import JoinTeam from "./components/JoinTeam";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import SelectTeams from "./components/SelectTeams";

import RoleBasedRoute from "./RoleBasedRoute";

import "./App.css";

export default function App() {
  // // Temporary preview: only show Header + AdminPortal
  // return (
  //   <Router>
  //     <AuthProvider>
  //     <Header />
  //     <StudentPortal />
  //     </AuthProvider>
  //   </Router>
  // );

  // Full project routing logic (uncomment when ready)
  return (
    <Router>
      <Header />
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Dev Role */}
          <Route
            path="/dev"
            element={
              <RoleBasedRoute allowedRoles={["dev"]}>
                <Home />
              </RoleBasedRoute>
            }
          />

          {/* Student */}
          <Route
            path="/home"
            element={
              <RoleBasedRoute allowedRoles={["student"]}>
                <StudentPortal />
              </RoleBasedRoute>
            }
          />

          {/* Mentor */}
          <Route
            path="/mentor/home"
            element={
              <RoleBasedRoute allowedRoles={["mentor"]}>
                <MentorPortal />
              </RoleBasedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/home"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminPortal />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/upload"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <Upload />
              </RoleBasedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/unauthorized" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
