import React, { useState, useEffect } from "react";
import axios from "axios";
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
    <div className="flex items-center justify-center bg-gray-100 px-4 mt-30">
  <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
      Join Team
    </h2>

    <div className="space-y-4">
      <input
        type="text"
        placeholder="Enter Team Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
      />

      <button
        type="button"
        onClick={joinTeam}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition duration-200"
      >
        Use Team Code
      </button>
    </div>
  </div>
</div>

  );
}
