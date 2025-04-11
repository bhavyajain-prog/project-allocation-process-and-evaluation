import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "../api/axios";

export default function StudentPortal() {
  const { user } = useAuth();
  const [linkInfo, setLinkInfo] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStudent = async () => {
      if (user) {
        setLoading(true);
        try {
          const { data } = await axios.get(`/student/${user.email}`);
          setStudentData(data);

          if (data.teamCode) {
            setLinkInfo({ link: "/my-team", text: "My Team" });
          } else {
            setLinkInfo({ link: "/join-team", text: "Join Team" });
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    getStudent();
  }, [user]);

  // Future actions can be added to this array for easy scaling
  const additionalActions = [
    { link: "/resources", text: "Resources", icon: "📚", visible: true },
    { link: "/assignments", text: "Assignments", icon: "📝", visible: true },
    { link: "/schedule", text: "Schedule", icon: "📅", visible: true },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Student Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                {loading ? "Loading..." : `Welcome, ${user?.name || "Student"}`}
              </p>
            </div>
            {studentData && studentData.teamCode && (
              <div className="mt-4 md:mt-0 bg-teal-50 text-teal-700 py-1 px-4 rounded-full text-sm font-medium">
                Team: {studentData.teamCode}
              </div>
            )}
          </div>
        </div>

        {/* Main Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Team Management
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse flex space-x-4">
                <div className="h-12 w-full bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : linkInfo ? (
            <div className="grid gap-4">
              <Link
                to={linkInfo.link}
                className="bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-md shadow transition duration-200 text-center font-medium flex items-center justify-center"
              >
                {linkInfo.text === "My Team" ? "👥 " : "🔍 "}
                {linkInfo.text}
              </Link>

              {linkInfo.text === "Join Team" && (
                <Link
                  to="/create-team"
                  className="bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-md shadow transition duration-200 text-center font-medium flex items-center justify-center"
                >
                  ✨ Create Team
                </Link>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Unable to load team information
            </p>
          )}
        </div>

        {/* Additional Actions - Easily Scalable */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {additionalActions.map(
              (action, index) =>
                action.visible && (
                  <Link
                    key={index}
                    to={action.link}
                    className="bg-white border border-gray-200 hover:border-teal-500 hover:bg-gray-50 text-gray-800 py-4 px-4 rounded-md shadow-sm transition duration-200 text-center font-medium flex flex-col items-center justify-center"
                  >
                    <span className="text-2xl mb-2">{action.icon}</span>
                    {action.text}
                  </Link>
                )
            )}
          </div>
        </div>

        {/* Status Card - For future use */}
        {studentData && studentData.teamCode && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Team Status
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-gray-600">Active</span>
              </div>
              <Link
                to="/team-details"
                className="text-teal-600 hover:text-teal-800 font-medium"
              >
                View Details
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
