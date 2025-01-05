import React, { useState } from "react";
import axios from "axios";
import logo from "./assets/logo.jpg";

export default function JoinTeam() {
  const [code, setCode] = useState("");
  const joinTeam = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/team/join", {
        code,
      }, { withCredentials: true });
      if (response.status === 200) {
        alert("Joined team successfully");
      }
      //   navigate to my team page [to be made]
    } catch (err) {}
  };

  return (
    <div>
      <div className="logo-container">
        <img src={logo} alt="logo" className="logo" />
      </div>
      <div className="container">
        <div className="title">Join Team</div>
        <div className="join-team">
          <h3>Join Team</h3>
          <input
            type="text"
            placeholder="Enter Team Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <br />
          <button type="button" onClick={joinTeam}>
            Use Team Code
          </button>
        </div>
      </div>
    </div>
  );
}
