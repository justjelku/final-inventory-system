import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignInPage from './components/auth/SignIn';
import { AuthProvider } from './context/AuthContext';
import SignUpPage from './components/auth/SignUp';
import ProtectedRoute from './components/pages/user/ProtectedRoute';
import RootPage from './components/pages/user/RootPage';
import AdminRootPage from './components/pages/admin/AdminRootPage';

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
          <Route 
          exact
          path="/admin" 
          element={
          <ProtectedRoute>
            <AdminRootPage />
           </ProtectedRoute>
        } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
