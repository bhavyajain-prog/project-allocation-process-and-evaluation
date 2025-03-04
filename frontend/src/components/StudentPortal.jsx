import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// TODO: Update the page so that when the current user is in the team, then dont show create team button and myteam button text update...
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
        localStorage.removeItem("role");
        await loggedOut();
        navigate("/login");
      }
    } catch (error) {}
  };
  return (
    <div>
      <div className="container mw-500">
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
        <h2 className="title">Dashboard</h2>
        <div className="link-group">
          <Link to="/join-team">My Team</Link>
          <Link to="/create-team">Create the team</Link>
        </div>
      </div>
    </div>
  );
}

export default StudentPortal;
