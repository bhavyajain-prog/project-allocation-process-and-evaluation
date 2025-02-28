import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        { username, password },
        { withCredentials: true }
      );

      if (res.data.user) {
        setUser(res.data.user);

        // Redirect based on role
        switch (res.data.user.role) {
          case "student":
            navigate("/student/home");
            break;
          case "mentor":
            navigate("/mentor/home");
            break;
          case "admin":
            navigate("/admin/home");
            break;
          default:
            navigate("/login");
        }
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Sign In</h2>
      <div className="form-container">
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
