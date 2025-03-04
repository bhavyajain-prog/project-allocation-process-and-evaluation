import React from "react";
import axios from "axios";

export default function ResetPassword() {
  const resetPass = async () => {
    let newPass = document.querySelector("input[type=password]").value;
    let confirmPass = document.querySelectorAll("input[type=password]")[1].value;
    if (newPass !== confirmPass) {
      alert("Passwords do not match!");
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    await axios
      .post("http://localhost:5000/api/auth/reset-password", { token, "newPassword" : newPass })
      .then((res) => {
      alert(res.data.message);
      })
      .catch((err) => {
      alert(err.response.data.message);
      });
  };
  return (
    <div className="container">
      <h2>Reset Password</h2>
      <label>New Password</label>
      <input type="password" placeholder="Enter new password" />
      <label>Confirm Password</label>
      <input type="password" placeholder="Confirm new password" />
      <button onClick={resetPass}>Reset</button>
    </div>
  );
}
