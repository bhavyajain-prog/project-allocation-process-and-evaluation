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
    <div className="flex justify-center items-center px-4 mt-35">
  <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-center">
    
    <h2 className="text-2xl font-semibold text-gray-800 mb-8">Dashboard</h2>
    
    <div className="flex flex-col gap-5">
      <Link
        to="/join-team"
        className="bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md shadow text-lg font-medium"
      >
        My Team
      </Link>
      <Link
        to="/create-team"
        className="bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-md shadow text-lg font-medium"
      >
        Create the team
      </Link>
    </div>
  </div>
</div>

  );
}

export default StudentPortal;
