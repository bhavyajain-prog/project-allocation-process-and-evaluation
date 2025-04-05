import React, { useState, useEffect } from "react";
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
    <div className="flex justify-center items-start px-4 py-10">
  <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
    <h1 className="text-2xl font-bold text-center mb-8">Team Selection</h1>

    <div id="team-list" className="space-y-6">
      {teams.length === 0 ? (
        <p className="text-center text-gray-600">No teams to view</p>
      ) : (
        teams.map((team, index) => (
          <div
            key={index}
            onClick={() => toggleDetails(index)}
            className="border rounded-md p-4 shadow hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <p>
                  <strong>Team Leader:</strong> {team.leader}
                </p>
                <p>
                  <strong>Project Title:</strong> {team.projectTitle}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={approveTeam(team.code)}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-1 rounded-md shadow"
                >
                  Approve
                </button>
                <button
                  onClick={rejectTeam(team.code)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md shadow"
                >
                  Reject
                </button>
              </div>
            </div>

            {/* Expandable Details */}
            {openTeamIndex === index && (
              <div className="mt-4 text-sm text-gray-700 space-y-2">
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
            )}
          </div>
        ))
      )}
    </div>
  </div>
</div>

  );
}
