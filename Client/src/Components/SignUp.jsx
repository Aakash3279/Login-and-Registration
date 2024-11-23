import React, { useState } from "react";
import axios from "axios";

function SignUp({ onToggleLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/api/auth/signup", { email, password });
      alert(response.data.message); // This will be the response from your backend
      onToggleLogin(); // Call this to toggle to the login form
    } catch (error) {
      alert(error.response?.data?.message || "Error signing up");
    }
  };

  return (
    <form className="form" onSubmit={handleSignUp}>
      <h2>Signup Form</h2>
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
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button type="submit">SignUp</button>
    </form>
  );
}

export default SignUp;
