import React from 'react';
import './header.css';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="header">
    <div className="logo-container">
      <Link to="/" className="logo">🩺 Pixel Neurons</Link>
    </div>
    <nav className="header-nav">
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>         {/* ✅ Added Home */}
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/prediction" className="nav-link">Prediction</Link>
        <Link to="/services" className="nav-link">Services</Link>
        <Link to="/contact" className="nav-link">Contact</Link>
      </div>
    </nav>
    <div className="auth-container">
      <Link to="/signup" className="btn signup-btn">Sign Up</Link>
      <Link to="/login" className="btn login-btn">Login</Link>
    </div>
  </header>
);

export default Header;
