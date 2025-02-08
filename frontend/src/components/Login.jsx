import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./assets/logo.jpg";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ login }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // TODO: Implement getCookie function
  // const getCookie = (name) => {
  //   const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  //   return match ? decodeURIComponent(match[2]) : null;
  // };
  // const token = getCookie('your_cookie_name');

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/user",
          { withCredentials: true }
        );

        if (response.data.role === "") {
          return;
        } else if (response.data.role === "student") {
          navigate("/student-dashboard");
          localStorage.setItem("role", "student");
        } else if (response.data.role === "dev") {
          navigate("/dev-dashboard");
          localStorage.setItem("role", "dev");
        } else if (response.data.role === "mentor") {
          navigate("/mentor-dashboard");
          localStorage.setItem("role", "mentor");
        } else if (response.data.role === "admin") {
          navigate("/admin-dashboard");
          localStorage.setItem("role", "admin");
        }
        login();
      } catch (err) {}
    };
    checkLogin();
  }, [navigate, login]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password, rememberMe },
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        if (response.data.role === "student") {
          navigate("/student-dashboard");
          localStorage.setItem("role", "student");
        } else if (response.data.role === "mentor") {
          navigate("/mentor-dashboard");
          localStorage.setItem("role", "mentor");
        } else if (response.data.role === "admin") {
          navigate("/admin-dashboard");
          localStorage.setItem("role", "admin");
        } else if (response.data.role === "dev") {
          navigate("/dev-dashboard");
          localStorage.setItem("role", "dev");
        }
        login();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Something went wrong!");
    }
  };

  return (
    <div>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
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
          {/* <div className="options">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="rememberMe">Remember Me</label>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div> */}
          <div className="options">
            <label className="rememberMe">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>
            <Link to="/forgot-password" className="forgotPass">Forgot Password?</Link>
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
