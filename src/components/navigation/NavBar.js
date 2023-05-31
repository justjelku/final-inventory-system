import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoxArrowRight } from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';
import { Modal, Button, Form, Popover } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import UserProfilePopover from '../pages/user/profile/ProfilePopOver';
import Sidebar from './SideBar';
import { List } from 'react-bootstrap-icons';

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showPopover, setShowPopover] = useState(true);

  const handleLogout = async () => {
    try {
      // Perform any additional logout logic here
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="navbar sticky-top navbar-light bg-light d-flex align-items-start m-1">
      <button
        class="btn btn-outline-secondary me-3 m-1"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasWithBothOptions"
        aria-controls="offcanvasWithBothOptions"
      >
        <List size={24}
        />
      </button>
      <div
        class="offcanvas offcanvas-start"
        data-bs-scroll="true"
        tabindex="-1"
        id="offcanvasWithBothOptions"
        aria-labelledby="offcanvasWithBothOptionsLabel"
        style={{ width: '200px' }}
      >
        <div class="offcanvas-header">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/my-anonymity-app.appspot.com/o/logo.png?alt=media&token=c2df7400-c4e2-4238-a1dd-6d75f1de6c10&_gl=1*tc2wwn*_ga*MTQwMzcxNzM1My4xNjgzNzMxOTI3*_ga_CW55HF8NVT*MTY4NTQ2NDk1My4xNy4xLjE2ODU0NjQ5ODguMC4wLjA."
            alt="Logo"
            className="img-fluid rounded mx-auto d-block mt-3"
            style={{
              width: '100px',
              height: '100px',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex'
            }}
          />
          <button 
          type="button" 
          class="btn-close text-reset" 
          data-bs-dismiss="offcanvas" 
          aria-label="Close">
          </button>
        </div>
        <div class="offcanvas-body">
          <Sidebar />
        </div>
      </div>
      <NavLink 
      to="/app" 
      className="me-auto mt-2"
      >
        Shoe Inventory Management System
      </NavLink>
      <form className="d-flex m-1">
        <input className="form-control me-3" type="search" placeholder="Search" aria-label="Search" />
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form>
      <button
        className="nav-link me-3 m-1"
        type="button"
        onClick={handleLogout}
      >
        <BoxArrowRight size={20} className="me-2" />
      </button>
    </div>
  );
};

export default NavBar;
