import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth(); // Add the `isLoading` state to your useAuth hook
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [isLoading]);

  if (loading) {
    // Authentication state is still loading, render a loading indicator or a different component
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', // Adjust the height as needed
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (user && window.location.pathname === '/signin') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
