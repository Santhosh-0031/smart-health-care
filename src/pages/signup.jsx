import React from 'react';
import './signup.css';

const Signup = () => {
  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Your Medical Account 🩺</h2>
        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email Address" required />
          <input type="tel" placeholder="Phone Number" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />
          <div className="checkbox-container">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <a href="#">terms and conditions</a>.
            </label>
          </div>
          <button type="submit">Signup</button>
          <p className="link">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
