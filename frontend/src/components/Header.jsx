import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { useAuth } from "./AuthContext";
import axios from "../api/axios";

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getDashboardRoute = () => {
    if (!user || !user.role) return "/";
    if (user.role === "admin") return "/admin/home";
    if (user.role === "mentor") return "/mentor/home";
    if (user.role === "student") return "/home";
    return "/";
  };

  // Pages that only show the logo
  const minimalRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const isMinimal = minimalRoutes.includes(location.pathname);

  return (
    <div className="bg-[#f1f2f7] shadow-md py-3 px-6 relative">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between relative">
        {isMinimal ? (
          <div className="w-full text-center">
            <img src={logo} alt="Logo" className="w-[55px] inline-block" />
          </div>
        ) : (
          <>
            {/* Left - Home */}
            <Link
              to={getDashboardRoute()}
              className="text-blue-600 font-semibold hover:underline z-10"
            >
              Home
            </Link>

            {/* Center - Absolutely centered logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img src={logo} alt="Logo" className="w-[55px]" />
            </div>

            {/* Right - Profile */}
            <div className="flex items-center space-x-4 z-10">
              {user && (
                <div className="bg-white shadow rounded-xl px-4 py-2 text-sm text-gray-700 flex items-center space-x-3">
                  <div className="font-medium">{user.name || "User"}</div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-[#dc2626] text-white font-semibold py-1 px-3 rounded transition duration-300 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
