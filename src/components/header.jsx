import React, { useContext } from 'react';
import './header.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import toast from 'react-hot-toast';

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // Clear the user data on logout
    toast.success('Logged out successfully');
    navigate('/'); // Redirect to the home page after logout
  };

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" className="logo">🩺 Pixel Neurons</Link>
      </div>
      <nav className="header-nav">
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/prediction" className="nav-link">Prediction</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>
      </nav>
      <div className="auth-container">
        {user ? (
          <>
            <span className="user-greeting">👋 {user.name} logged in</span>
            <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/signup" className="btn signup-btn">Sign Up</Link>
            <Link to="/login" className="btn login-btn">Login</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
