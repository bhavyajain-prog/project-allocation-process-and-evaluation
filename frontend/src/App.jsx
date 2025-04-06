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
import NotFound from "./components/NotFound";
import Register from "./components/Register";
import Redirect from "./components/Redirect";
import Upload from "./components/AdminUpload";

import RoleBasedRoute from "./RoleBasedRoute";

import "./App.css";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Redirect />} />
          <Route path="/notfound" element={<NotFound />} />

          {/* Dev Role */}
          <Route
            path="/dev"
            element={
              <RoleBasedRoute allowedRoles={["dev"]}>
                <Home />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <RoleBasedRoute allowedRoles={["dev", "admin"]}>
                <Register />
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
          <Route path="*" element={<Navigate to="/notfound" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
