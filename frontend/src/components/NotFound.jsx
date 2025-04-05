import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 text-center px-4 mt-30">
  <h2 className="text-3xl font-bold text-red-600 mb-4">404 - Page not found</h2>
  <p className="text-gray-700 mb-6">This page does not exist!</p>
  <Link
    to="/"
    className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-md shadow"
  >
    Go Back to Login
  </Link>
</div>

  );
}
