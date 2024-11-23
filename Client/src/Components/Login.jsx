import React, { useState } from "react";
import axios from "axios";

function Login({ onToggleSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login", // Backend login endpoint
        { email, password },
        { withCredentials: true } // Ensure cookies are sent for session management
      );
      if (response.data.user) {
        alert("Login successful!");
        // Redirect to secrets page or update app state
        window.location.href = "http://localhost:3000/secrets"; // Adjust based on your needs
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error logging in");
    }
  };

  return (
    <form className="form" onSubmit={handleLogin}>
      <h2>Login Form</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      <p>
        Not a Member?{" "}
        <a href="#" onClick={onToggleSignUp}>
          Signup now
        </a>
      </p>
    </form>
  );
}

export default Login;
