import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignInPage from './components/auth/SignIn';
import RootPage from './components/RootPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SignUpPage from './components/auth/SignUp';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route 
          exact
          path="/*" 
          element={
           <ProtectedRoute>
            <RootPage />
           </ProtectedRoute>
        } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
