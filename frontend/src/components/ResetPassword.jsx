import React from "react";

const ResetPassword = () => (
  <div className="container">
    <h2>Reset Password</h2>
    <label>New Password</label>
    <input type="password" placeholder="Enter new password" />
    <label>Confirm Password</label>
    <input type="password" placeholder="Confirm new password" />
    <button>Reset</button>
  </div>
);

export default ResetPassword;
