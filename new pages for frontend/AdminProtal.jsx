import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";

export default function AdminPortal() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const flushAll = async () => {
    setIsLoading(true);
    try {
      await axios.delete("/admin/flush-all");
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
    } catch (err) {
      alert("Error deleting the data!");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const adminActions = [
    { to: "/admin/upload", name: "Upload Data", icon: "📤" },
    { to: "/admin/teams", name: "Approve Teams", icon: "✅" },
    { to: "/admin/manage/mentors", name: "Manage Mentors", icon: "👨‍🏫" },
    { to: "/admin/manage/students", name: "Manage Students", icon: "👨‍🎓" },
    { to: "/admin/manage/teams", name: "Manage Teams", icon: "👥" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center pt-12 pb-20 px-4">
      {/* Header */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Portal</h1>
        <p className="text-gray-600">Manage your platform data and users</p>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
        {/* Action Cards */}
        <div className="md:col-span-2 grid md:grid-cols-3 gap-4">
          {adminActions.map((action, index) => (
            <Link
              key={index}
              to={action.to}
              className="bg-white hover:bg-gray-50 rounded-lg shadow-md p-6 border-l-4 border-teal-500 flex flex-col items-center justify-center transition duration-300 transform hover:-translate-y-1"
            >
              <span className="text-3xl mb-3">{action.icon}</span>
              <h3 className="font-semibold text-gray-800">{action.name}</h3>
            </Link>
          ))}
        </div>

        {/* Data Management Panel */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Data Management
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-700">Database Controls</h3>
              <p className="text-sm text-gray-500">
                Clear all data from the system
              </p>
            </div>

            <button
              onClick={flushAll}
              disabled={isLoading}
              className={`bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg flex items-center shadow-md transition duration-300 ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <span className="mr-2">Processing</span>
                  <span className="animate-pulse">...</span>
                </>
              ) : (
                <>
                  <span className="mr-2">Flush Data</span>
                  <span>🗑️</span>
                </>
              )}
            </button>
          </div>

          {showConfirmation && (
            <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-md flex items-center">
              <span className="mr-2">✓</span>
              Data cleared successfully!
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Teams</h3>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-teal-500">24</div>
            <div className="text-sm text-gray-500">Active Teams</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Pending Approvals
          </h3>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-teal-500">7</div>
            <div className="text-sm text-gray-500">Teams Awaiting Approval</div>
          </div>
        </div>
      </div>
    </div>
  );
}
