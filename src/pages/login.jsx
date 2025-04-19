import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './login.css';
import toast from 'react-hot-toast';

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    
    // For now, assume any user is valid
    setUser({ name: 'Santhosh' }); // This can be adjusted based on the actual login response
    toast.success('Successfully logged in!');
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login to Your Account 🩺</h2>
        <form onSubmit={handleSubmit}>
          <input 
            name="email" 
            type="email" 
            placeholder="Email Address" 
            onChange={handleChange} 
            required 
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
          />
          <button type="submit">Login</button>
          <p className="form-footer">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
