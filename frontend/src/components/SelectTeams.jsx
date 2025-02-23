import React, { useState, useEffect } from "react";
import logo from "./assets/logo.jpg";
import axios from "axios";

export default function SelectTeams() {
  const [teams, setTeams] = useState([]);
  const [openTeamIndex, setOpenTeamIndex] = useState(null);

  useEffect(() => {
    const getTeams = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/mentor/teams",
          { withCredentials: true }
        );
        setTeams(data.teams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    getTeams();
  }, []);

  const toggleDetails = (index) => {
    setOpenTeamIndex(openTeamIndex === index ? null : index);
  };

  const approveTeam = async (code) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/mentor/team/${code}/accept`,
        { withCredentials: true }
      );
      console.log("Approved team: ", code);
      //TODO: update frontend to display message on screen
    } catch (error) {
      console.error("Error connecting to the server: ", error);
    }
  };

  const rejectTeam = async (code) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/mentor/team/${code}/reject`,
        { withCredentials: true }
      );
      console.log("Rejected team: ", code);
      //TODO: update frontend to display message on screen
    } catch (error) {
      console.error("Error connecting to the server: ", error);
    }
  };

  return (
    <div>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="form-container">
        <h1>Team Selection</h1>
        <div id="team-list">
          {teams.length === 0 ? (
            <p>No teams to view</p>
          ) : (
            teams.map((team, index) => (
              <div
                className="team-row"
                key={index}
                onClick={() => toggleDetails(index)}
              >
                <div className="team-info">
                  <span>
                    <strong>Team Leader:</strong> {team.leader}
                  </span>
                  <span>
                    <strong>Project Title:</strong> {team.projectTitle}
                  </span>
                  <div>
                    <button
                      className="approve-btn"
                      onClick={approveTeam(team.code)}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={rejectTeam(team.code)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
                <div
                  className={`team-details ${
                    openTeamIndex === index ? "active" : ""
                  }`}
                >
                  <p>
                    <strong>Team Members:</strong> {team.members}
                  </p>
                  <p>
                    <strong>Technology:</strong> {team.technology}
                  </p>
                  <p>
                    <strong>Description:</strong> {team.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
