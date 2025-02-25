import React, { useEffect, useState } from "react";
import logo from "../assets/logo.jpg";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ login }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Mock function simulating a backend role check
  const mockCheckLogin = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ role: localStorage.getItem("role") || "" });
      }, 500);
    });
  };

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await mockCheckLogin();

        switch (response.role) {
          case "student":
            navigate("/student-dashboard");
            break;
          case "mentor":
            navigate("/mentor-dashboard");
            break;
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "dev":
            navigate("/dev-dashboard");
            break;
          default:
            break;
        }

        if (response.role) {
          login();
        }
      } catch (err) {
        console.error("Login check failed", err);
      }
    };

    checkLogin();
  }, [navigate, login]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Simulating login logic
    try {
      if (username === "student" && password === "1234") {
        localStorage.setItem("role", "student");
        navigate("/student-dashboard");
      } else if (username === "mentor" && password === "1234") {
        localStorage.setItem("role", "mentor");
        navigate("/mentor-dashboard");
      } else if (username === "admin" && password === "1234") {
        localStorage.setItem("role", "admin");
        navigate("/admin-dashboard");
      } else if (username === "dev" && password === "1234") {
        localStorage.setItem("role", "dev");
        navigate("/dev-dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
        return;
      }
      login();
    } catch (err) {
      setError("Something went wrong!");
    }
  };

  return (
    <div>
      <div className="container mw-500">
        <h2 className="title">Sign In</h2>
        <form onSubmit={handleLogin} className="form-container">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="options">
            <label className="rememberMe">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>
            <Link to="/forgot-password" className="forgotPass">
              Forgot Password?
            </Link>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" className="btn-grn">
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  );
}
