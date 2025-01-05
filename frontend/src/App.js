import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Register from "./components/Register";
import DevDashboard from "./components/Home";
import StudentDashboard from "./components/StudentPortal";
import MentorDashboard from "./components/MentorPortal";
import AdminDashboard from "./components/AdminPortal";
import CreateTeam from "./components/CreateTeam";
import JoinTeam from "./components/JoinTeam";
import NotFound from "./components/NotFound";

const App = () => {
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  // Custom Private Route Wrapper
  const PrivateRoute = ({ element, allowedRoles }) => {
    if (role === "dev") {
      return element;
    }
    if (allowedRoles.includes(role)) {
      return element;
    } else {
      return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            <Login login={() => setRole(localStorage.getItem("role"))} />
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/student-dashboard"
          element={
            <PrivateRoute
              element={<StudentDashboard />}
              allowedRoles={["student"]}
            />
          }
        />
        <Route
          path="/create-team"
          element={
            <PrivateRoute element={<CreateTeam />} allowedRoles={["student"]} />
          }
        />
        <Route
          path="/join-team"
          element={
            <PrivateRoute element={<JoinTeam />} allowedRoles={["student"]} />
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute
              element={<AdminDashboard />}
              allowedRoles={["admin"]}
            />
          }
        />
        <Route
          path="/mentor-dashboard"
          element={
            <PrivateRoute
              element={<MentorDashboard />}
              allowedRoles={["mentor"]}
            />
          }
        />
        <Route
          path="/dev-dashboard"
          element={
            <PrivateRoute
              element={<DevDashboard loggedOut={() => setRole("")} />}
              allowedRoles={["dev"]}
            />
          }
        />
        <Route
          path="/register"
          element={
            <PrivateRoute element={<Register />} allowedRoles={["dev"]} />
          }
        />

        {/* Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
