// src/context/UserProvider.jsx
import React, { useState } from 'react';
import { UserContext } from './UserContext'; // Correct import path to UserContext

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State for logged-in user

  return (
    // Provide the user and setUser function to all child components
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
