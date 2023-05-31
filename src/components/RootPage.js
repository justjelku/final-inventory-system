import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeTabContent from './pages/user/contents/Home';
import ProfileTabContent from './pages/user/contents/Profile';
import ProductTabContent from './pages/user/contents/Products';
import Sidebar from './navigation/SideBar';
import NavBar from './navigation/NavBar';
import WelcomePage from './pages/WelcomePage';
import { AuthProvider } from '../context/AuthContext';

const RootPage = () => {
  return (
      <div className='container'>
      <NavBar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <Routes>
              <Route path="/app" component={<WelcomePage />} element={<WelcomePage />} />
              <Route path="/app/home" component={<HomeTabContent />} element={<HomeTabContent />} />
              <Route path="/app/profile" component={<ProfileTabContent />} element={<ProfileTabContent />} />
              <Route path="/app/inventory" component={<ProductTabContent />} element={<ProductTabContent />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RootPage;
