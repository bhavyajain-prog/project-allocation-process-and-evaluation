import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/logo.jpg";
import axios from "axios";

function MentorPortal({ loggedOut }) {
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
        localStorage.removeItem("role");
        await loggedOut();
        navigate("/login");
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="logo-container">
        <img src={logo} alt="logo" className="logo" />
      </div>
      <div className="container mw-500">
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
        <div className="title">
          <h2>Mentor Portal</h2>
        </div>
        <div className="link-group">
          <Link to="/select-teams">Team Selection</Link>
          <Link to="/mentordashboard">Dashboard</Link>
          <Link to="/documentapproval">Approve Docs</Link>
        </div>
      </div>
    </>
  );
}

export default MentorPortal;
