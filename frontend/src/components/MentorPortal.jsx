import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
      <div className="bg-gray-100 flex flex-col items-center justify-center px-4 mt-40">
  {/* Title */}
  <h2 className="text-[2rem] font-semibold mb-8">Mentor Portal</h2>

  {/* Links */}
  <div className="flex flex-col gap-7 w-50">
    <Link
      to="/select-teams"
      className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-md text-center shadow"
    >
      Team Selection
    </Link>
    <Link
      to="/mentordashboard"
      className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-md text-center shadow"
    >
      Dashboard
    </Link>
    <Link
      to="/documentapproval"
      className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-md text-center shadow"
    >
      Approve Docs
    </Link>
  </div>
</div>

    </>
  );
}

export default MentorPortal;
