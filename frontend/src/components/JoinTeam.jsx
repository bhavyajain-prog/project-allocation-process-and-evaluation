import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "./assets/logo.jpg";
import { useNavigate } from "react-router-dom";

export default function JoinTeam() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkTeam = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/team/get-team",
          { withCredentials: true }
        );
        if (response.status === 500) {
          alert("Server error!");
        }
        if (response.status === 200) {
          navigate("/myteam");
        }
      } catch (err) {}
    };

    checkTeam();
  }, [navigate]);

  const joinTeam = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/team/join",
        {
          code,
        },
        { withCredentials: true }
      );

      navigate("/myteam");
    } catch (err) {
      console.error("Failed to join team:", err);
      alert("Failed to join team. Please check the team code and try again.");
    }
  };

  return (
    <div>
      <div className="logo-container">
        <img src={logo} alt="logo" className="logo" />
      </div>
      <div className="container mw-500">
        <div className="title">Join Team</div>
        <div className="input-button-container">
          <input
            type="text"
            placeholder="Enter Team Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button type="button" onClick={joinTeam} className="btn-grn">
            Use Team Code
          </button>
        </div>
      </div>
    </div>
  );
}
