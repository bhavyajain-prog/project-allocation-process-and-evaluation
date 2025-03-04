import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminPortal({ loggedOut }) {
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
      <div className="container mw-500">
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
        <div className="title">
          <h2>Admin Portal</h2>
        </div>
        <div className="link-group">
          <Link className="btn" to="/mentorstatusadmin">
            Mentor Status
          </Link>
          <Link className="btn" to="/adminteamoverview">
            Team Status
          </Link>
          <Link className="btn" to="/documentapproval">
            Approve Docs
          </Link>
          <Link className="btn" to="/adminuploadsection">
            Upload docs
          </Link>
        </div>
      </div>
    </>
  );
}
