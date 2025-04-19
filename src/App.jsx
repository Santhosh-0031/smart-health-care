import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Home from './pages/home';
import Prediction from './pages/prediction';
import Login from './pages/login';
import Signup from './pages/signup';
import { Toaster } from 'react-hot-toast'; // ✅ Import the toaster
import { UserContext } from './context/UserContext'; // Import the context
import './index.css';

function App() {
  const { user } = useContext(UserContext); // Consume the context to get the user data

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} /> {/* ✅ Add Toaster here */}
      <Router>
        {/* You can conditionally render based on whether the user is logged in */}
        <Header user={user} /> {/* Pass the user to Header component if needed */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
