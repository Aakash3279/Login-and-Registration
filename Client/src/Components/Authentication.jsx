import React, { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-toggle">
          <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>
            SignUp
          </button>
        </div>
        {isLogin ? (
          <Login onToggleSignUp={toggleForm} />
        ) : (
          <SignUp onToggleLogin={toggleForm} />
        )}
      </div>
    </div>
  );
}

export default AuthForm;

