import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-header">SIGN IN</div>
        <div className="login-avatar">
          <img src="avatar-placeholder.png" alt="avatar" />
        </div>
        <div className="input-group">
          <label>
            <i className="fa fa-user"></i>
            <input type="email" name="email" placeholder="username" value={formData.email} onChange={handleChange} required />
          </label>
        </div>
        <div className="input-group">
          <label>
            <i className="fa fa-lock"></i>
            <input type="password" name="password" placeholder="password" value={formData.password} onChange={handleChange} required />
          </label>
        </div>
        <div className="login-options">
          <label>
            <input type="checkbox" name="remember" />
            Remember me
          </label>
          <a href="/">Forgot your password?</a>
        </div>
        <button type="submit" className="login-button">LOGIN</button>
      </form>
    </div>
  );
};

export default Login;
