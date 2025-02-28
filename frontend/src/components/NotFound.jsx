import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container">
      <h2 className="title">404 - Page not found</h2>
      <p>This page does not exist!</p>
      <Link to="/">Go Back to Login</Link>
    </div>
  );
}
