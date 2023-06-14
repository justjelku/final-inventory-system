import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignInPage from './components/auth/SignIn';
import { AuthProvider } from './context/AuthContext';
import SignUpPage from './components/auth/SignUp';
import ProtectedRoute from './components/pages/user/ProtectedRoute';
import RootPage from './components/pages/user/RootPage';
import AdminRootPage from './components/pages/admin/AdminRootPage';
import SignInAdmin from './components/auth/SignInAdmin';
import SuperAdminRootPage from './components/pages/superadmin/SuperAdminRootPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>s
          <Route path="/signInAdmin" element={<SignInAdmin />} />
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
          path="/admin/*" 
          element={
          <ProtectedRoute>
            <AdminRootPage />
           </ProtectedRoute>
        } 
          />
          <Route 
          exact
          path="/superadmin/*" 
          element={
          <ProtectedRoute>
            <SuperAdminRootPage />
           </ProtectedRoute>
        } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
