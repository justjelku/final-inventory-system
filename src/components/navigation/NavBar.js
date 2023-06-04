import React, {useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoxArrowRight } from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';
import { Modal, Button, Form, Popover } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './SideBar';
import { List } from 'react-bootstrap-icons';
import Sidebarss from './sidebars';

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showPopover, setShowPopover] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Function to check if the current view is mobile
    const checkMobileView = () => {
      const mobileView = window.matchMedia('(max-width: 1000px)').matches;
      setIsMobileView(mobileView);
    };

    // Initial check when the component mounts
    checkMobileView();

    // Listen for window resize events to update the view
    window.addEventListener('resize', checkMobileView);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);

  useEffect(() => {
    // Function to check if the page is scrolled
    const checkScroll = () => {
      const scrolled = window.pageYOffset > 0;
      setIsScrolled(scrolled);
    };

    // Listen for scroll events to update the view
    window.addEventListener('scroll', checkScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', checkScroll);
    };
  }, []);

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
    <div 
    className={`navbar sticky-top navbar-white bg-white d-flex align-items-start${isScrolled ? ' scrolled' : ''}`}>
      {isMobileView && (
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
      )}
      <div
        class="offcanvas offcanvas-start"
        data-bs-scroll="true"
        tabindex="-1"
        id="offcanvasWithBothOptions"
        aria-labelledby="offcanvasWithBothOptionsLabel"
        style={{ width: '200px' }}
      >
        <div class="offcanvas-header">
          {/* <img
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
          /> */}
          {/* <button
            type="button"
            class="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close">
          </button> */}
        </div>
        <div class="offcanvas-body">
          <Sidebarss />
        </div>
      </div>
      <NavLink
        to="/"
        className="me-auto mt-2"
      >
        
      </NavLink>
      <form className="d-flex me-auto justify-content-end align-items-end">
        {/* <input className="form-control me-3" type="search" placeholder="Search" aria-label="Search" />
        <button className="btn btn-outline-success" type="submit">Search</button> */}
      </form>
      {/* <button
        className="nav-link me-3 m-1"
        type="button"
        onClick={handleLogout}
      >
        <BoxArrowRight size={20} className="me-2" />
      </button> */}
    </div>
  );
};

export default NavBar;
