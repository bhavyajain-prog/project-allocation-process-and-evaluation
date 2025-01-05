import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/logo.jpg";
import axios from "axios";

function StudentPortal({ loggedOut }) {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/logout",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        loggedOut();
        navigate("/login");
      }
    } catch (error) {}
  };
  return (
    <div>
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
      <h2 className="title">Dashboard</h2>
      <div className="menu">
        <Link to="/join-team" className="nav-btn">
          My Team
        </Link>
        <Link to="/create-team" className="nav-btn">
          Create the team
        </Link>
      </div>
    </div>
  );
}

export default StudentPortal;
