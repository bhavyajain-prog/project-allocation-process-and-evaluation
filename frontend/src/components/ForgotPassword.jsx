import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [response, setResponse] = useState(false);
  const forgotPass = async () => {
    const email = document.querySelector("input[type=email]").value;
    await axios
      .post("http://localhost:5000/api/auth/forgot-password", { email })
      .then((res) => {
        alert(res.data.message);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
    setResponse(true);
  };

  return (
    <div className="container">
      <h2>Forgot Password</h2>
      <label>Email</label>
      <input type="email" placeholder="Enter your email" />
      <button onClick={forgotPass}>Submit</button>
      {response && <p>Mail sent successfully!</p>}
    </div>
  );
}
