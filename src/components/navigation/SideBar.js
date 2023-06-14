// import React, { useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { BoxArrowRight, BuildingFill, CartFill } from 'react-bootstrap-icons';
// import { HouseFill, PersonFill, PeopleFill, TruckFrontFill } from 'react-bootstrap-icons';
// import { useAuth } from '../../context/AuthContext';
// import ProfileIcon from '../pages/user/profile/ProfileIcon';

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const { logout } = useAuth();

//   const handleLogout = async () => {
//     try {
//       // Perform any additional logout logic here
//       await logout();
//       navigate('/signin');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   return (
//     <div class="container ">
//       <div class='row'>
//         <div class='col-md-4'>
//           <div class='mt-5'>
//             <nav className="sidebar">
//               <ul className="nav flex-column nav-pills">
//                 <li className="nav-item mt-5">
//                   <NavLink
//                     exact to="/home"
//                     className="nav-link d-flex align-items-center"
//                     activeClassName="active"
//                     aria-current="page"
//                   >
//                     <HouseFill size={30} className="me-2" />
//                     Home
//                   </NavLink>
//                 </li>
//                 <li className="nav-item mt-3">
//                   <NavLink
//                     to="/inventory"
//                     className="nav-link d-flex align-items-center"
//                     activeClassName="active"
//                   >
//                     <CartFill size={30} className="me-2" />
//                     Inventory
//                   </NavLink>
//                 </li>
//                 <li className="nav-item mt-3">
//                   <NavLink
//                     to="/customer"
//                     className="nav-link d-flex align-items-center"
//                     activeClassName="active"
//                   >
//                     <PeopleFill size={30} className="me-2" />
//                     Customer
//                   </NavLink>
//                 </li>
//                 <li className="nav-item mt-3">
//                   <NavLink
//                     to="/supplier"
//                     className="nav-link d-flex align-items-center"
//                     activeClassName="active"
//                   >
//                     <TruckFrontFill size={30} className="me-2" />
//                     Supplier
//                   </NavLink>
//                 </li>
//                 <li className="nav-item mt-3">
//                   <NavLink
//                     to="/branch"
//                     className="nav-link d-flex align-items-center"
//                     activeClassName="active"
//                   >
//                     <BuildingFill size={30} className="me-2" />
//                     Branch
//                   </NavLink>
//                 </li>
//                 <li className="nav-item mt-3">
//                   <NavLink
//                     to="/profile"
//                     className="nav-link d-flex align-items-center"
//                     activeClassName="active"
//                   >
//                     <PersonFill size={30} className="me-2" />
//                     Profile
//                   </NavLink>
//                 </li>
//                 <li className="nav-item fixed-bottom">
//                 <div class="container-fluid d-flex align-items-center m-3">
//                 <ProfileIcon />
//                 <button
//                     className="nav-link d-flex align-items-center m-1"
//                     type="button"
//                     onClick={handleLogout}
//                   >
//                     <BoxArrowRight size={30} className="me-2" />
//                   </button>
//                   </div>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
