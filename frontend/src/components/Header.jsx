import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
    if (user.role === "dev") return "/dev";
    return "/";
  };

  const path = location.pathname;

  const isMinimalOnlyLogo = ["/login", "/notfound"].includes(path);
  const isResetFlow =
    path === "/forgot-password" || path.startsWith("/reset-password");

  return (
    <div className="bg-[#f1f2f7] shadow-md py-3 px-6 relative min-h-[70px]">
      <div className="max-w-screen-xl mx-auto relative min-h-[50px]">
        {isMinimalOnlyLogo ? (
          // Only logo centered
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <a
              href="https://erp.skit.ac.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={logo}
                alt="SKIT ERP"
                className="w-[55px] hover:scale-105 transition-transform duration-200"
              />
            </a>
          </div>
        ) : (
          <>
            {/* Left - Back button */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
              <button
                onClick={() => {
                  isResetFlow
                    ? navigate("/login")
                    : navigate(getDashboardRoute());
                }}
                className="text-blue-600 font-semibold hover:underline px-4"
              >
                {isResetFlow ? "Back to Login" : "Home"}
              </button>
            </div>

            {/* Center - Logo */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <a
                href="https://erp.skit.ac.in"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={logo}
                  alt="SKIT ERP"
                  className="w-[55px] hover:scale-105 transition-transform duration-200"
                />
              </a>
            </div>

            {/* Right - Profile and Logout */}
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 pr-4">
              {user && !isResetFlow && (
                <div className="bg-white shadow rounded-xl px-4 py-2 text-sm text-gray-700 flex items-center space-x-3">
                  <div className="font-medium">{user.name || "User"}</div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-[#dc2626] text-white font-semibold py-1 px-3 rounded transition duration-300"
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
