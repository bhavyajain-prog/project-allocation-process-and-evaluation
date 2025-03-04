import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cpass, setCpass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== cpass) {
      setError("Passwords do not match");
      return;
    }
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          username,
          password,
          role,
          email,
          phone,
        }
      );
      if (!data.registered) {
        setSuccess("");
        setError(data.message);
      } else {
        setError("");
        setSuccess(data.message);
      }
    } catch (error) {
      setError("Server Error! Please try again later");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>Username:</label>
        <input
          type="text"
          placeholder="Enter a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Name:</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Phone:</label>
        <input
          type="text"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          placeholder="Confirm your password"
          value={cpass}
          onChange={(e) => setCpass(e.target.value)}
          required
        />
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select a role</option>
          <option value="student">Student</option>
          <option value="coordinator">Project Coordinator</option>
          <option value="mentor">Mentor</option>
          <option value="subcordinator">Lab Coordinator</option>
        </select>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
