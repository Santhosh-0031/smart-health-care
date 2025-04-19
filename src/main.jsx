import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import UserProvider from './context/UserProvider'; // Import UserProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap the App component with UserProvider */}
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
