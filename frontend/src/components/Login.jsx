import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./assets/logo.jpg";
import { useNavigate } from "react-router-dom";

export default function Login({ login }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

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
      } catch (err) {
        console.log(err);
      }
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
      console.log(response.data);

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
      <div className="container">
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
            <a onClick={() => navigate("/forgot-password")}>Forgot Password?</a>
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
