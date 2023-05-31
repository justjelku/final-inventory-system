import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BoxArrowRight } from 'react-bootstrap-icons';
import { HouseFill, PersonFill, ArchiveFill } from 'react-bootstrap-icons';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
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
    <div className="d-flex flex-column">
      <nav className="sidebar">
        <ul className="nav flex-column nav-pills">
          <li className="nav-item m-3">
            <NavLink
              exact to="app/home"
              className="nav-link d-flex align-items-center"
              activeClassName="active"
              aria-current="home"
            >
              <HouseFill size={30} className="me-2" />
              Home
            </NavLink>
          </li>
          <li className="nav-item m-3">
            <NavLink
              to="app/profile"
              className="nav-link d-flex align-items-center"
              activeClassName="active"
            >
              <PersonFill size={30} className="me-2" />
              Profile
            </NavLink>
          </li>
          <li className="nav-item m-3">
            <NavLink
              to="app/inventory"
              className="nav-link d-flex align-items-center"
              activeClassName="active"
            >
              <ArchiveFill size={30} className="me-2" />
              Inventory
            </NavLink>
          </li>
        </ul>
        {/* <button
          className="nav-link mt-auto m-1 d-flex align-items-center"
          type="button"
          onClick={handleLogout}
          ><BoxArrowRight size={20} className="me-2 m-3" />Log Out
        </button> */}
      </nav>
    </div>
  );
};

export default Sidebar;
