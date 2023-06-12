import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'tailwindcss/tailwind.css';
import {App} from './App';
import ProtectedRoute from './components/pages/user/ProtectedRoute';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App>
      <ProtectedRoute />
    </App>
  </React.StrictMode>
);

