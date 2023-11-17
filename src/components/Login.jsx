// Login.js

import React, { useState } from 'react';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import '../App.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    // Add your authentication logic here
    console.log('Signing in with:', username, password);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
        <div>
        <h1 style={{fontSize: "36px", marginBottom: "40px"}}>
            Venue Admin Login </h1>
        </div>
        <div className="form-container">
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="input"
          />
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input"
            />
            <span className="password-toggle" onClick={handleTogglePassword}>
              <Icon className="eye-icon" icon={showPassword ? eyeOff : eye} size={25} />
            </span>
          </div>

          <button onClick={handleSignIn} className="signin-button">
            Sign In
          </button>
          <div className="registration-link">
            <a href="#" style={{"text-decoration":"none", "color": "white"}}>New registration?</a>
          </div>
        </div>
    </div>
  );
};

export default Login;
