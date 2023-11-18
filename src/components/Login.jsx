import React, { useState } from 'react';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {login} = useAuth();

  const handleSignIn = async () => {
    try {
      const response = await axios.post('https://stg.dhunjam.in/account/admin/login', {
        username,
        password,
      });

      const {data} = response.data;

      if (response.data.status === 200) {
        console.log('Authentication successful');
        console.log('User ID:', data.id);

        localStorage.setItem('authToken', data.token);

        login({
            user: {
              id: data.id,
            }
          });
  
        navigate('/admin-dashboard');

      }

    } catch (error) {
      console.error('Authentication failed. Error during authentication:', error);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
        <div>
        <h1 style={{fontSize: "36px", marginBottom: "40px", fontWeight:"bold", maxWidth:"600px"}}>
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
              <Icon className="eye-icon" icon={showPassword ? eye : eyeOff} size={25} />
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
