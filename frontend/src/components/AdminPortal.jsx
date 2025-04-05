import React from "react";
import { Link } from "react-router-dom";

export default function AdminPortal() {
  return (
    <div className="bg-[#f1f2f7] flex items-center justify-center">
      {/* Admin Portal Content */}
      <div className="text-center mt-30">
        <h2 className="text-[2rem] font-semibold mb-8">Admin Portal</h2>
        <div className="space-y-8">
          <Link
            className="block bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded shadow"
            to="/mentorstatusadmin"
          >
            Mentor Status
          </Link>
          <Link
            className="block bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded shadow"
            to="/adminteamoverview"
          >
            Team Status
          </Link>
          <Link
            className="block bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded shadow"
            to="/documentapproval"
          >
            Approve Docs
          </Link>
          <Link
            className="block bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded shadow"
            to="/adminuploadsection"
          >
            Upload Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
