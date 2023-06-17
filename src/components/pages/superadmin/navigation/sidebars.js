import {
	CDBSidebar,
	CDBSidebarContent,
	CDBSidebarFooter,
	CDBSidebarHeader,
	CDBSidebarMenu,
	CDBSidebarMenuItem,
} from 'cdbreact';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {
	collection,
	onSnapshot,
	doc,
	getDoc
} from 'firebase/firestore';
import ProfileIcon from '../profile/ProfileIcon';
import { useAuth } from '../../../../context/AuthContext';
import { db } from '../../../../firebase';

const Sidebarss = () => {
	const [sidebarMinimized, setSidebarMinimized] = useState(false);
	const { logout } = useAuth();
	const navigate = useNavigate();

	// STATE
	const [user, setUser] = useState([]);
	const [userId, setUserId] = useState(null);

	useEffect(() => {
		const unsubscribeAuth = firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				setUserId(user.uid);
			} else {
				setUserId(null);
			}
		});

		return () => unsubscribeAuth();
	}, []);

	useEffect(() => {
		if (userId) {
		  const getUserData = async () => {
			try {
			  const docRef = doc(db, 'users', 'qIglLalZbFgIOnO0r3Zu');
			  const docSnap = await getDoc(docRef);
			  if (docSnap.exists()) {
				setUser({ id: docSnap.id, ...docSnap.data() });
			  } else {
				console.log('Document not found!');
			  }
			} catch (error) {
			  console.error('Error getting document:', error);
			}
		  };
	  
		  getUserData();
		}
	  }, [userId]);

	const toggleSidebar = () => {
		setSidebarMinimized(!sidebarMinimized);
	};

	const handleLogout = async () => {
		try {
			// Perform any additional logout logic here
			await logout();
			navigate('/signInAdmin');
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	return (
		<div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
			<CDBSidebar textColor="#fff" backgroundColor="#333" className={sidebarMinimized ? 'sidebar-minimized' : ''}>
				<CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
					<a href="/superadmin/home" className="text-decoration-none" style={{ color: 'inherit' }}>
						Shoe Inventory SuperAdmin
					</a>
				</CDBSidebarHeader>

				<CDBSidebarContent className="sidebar-content">
					<CDBSidebarMenu>
						<NavLink exact to="/superadmin/home" activeClassName="activeClicked">
							<CDBSidebarMenuItem icon="home">Home</CDBSidebarMenuItem>
						</NavLink>
						<NavLink exact to="/superadmin/manageuser" activeClassName="activeClicked">
							<CDBSidebarMenuItem icon="home">Manage Users</CDBSidebarMenuItem>
						</NavLink>
						{/* <NavLink exact to="/superadmin/inventory" activeClassName="activeClicked">
							<CDBSidebarMenuItem icon="box">Inventory</CDBSidebarMenuItem>
						</NavLink>
						<NavLink exact to="/superadmin/stocks" activeClassName="activeClicked">
							<CDBSidebarMenuItem icon="shopping-cart">Stocks</CDBSidebarMenuItem>
						</NavLink>
						<NavLink exact to="/superadmin/supplier" activeClassName="activeClicked">
							<CDBSidebarMenuItem icon="truck">Supplier</CDBSidebarMenuItem>
						</NavLink>
						<NavLink exact to="/superadmin/branch" activeClassName="activeClicked">
							<CDBSidebarMenuItem icon="building">Branch</CDBSidebarMenuItem>
						</NavLink> */}
					</CDBSidebarMenu>
				</CDBSidebarContent>

				<CDBSidebarFooter>
					<div className="container-fluid d-flex align-items-center m-3">
						{!sidebarMinimized && (
							<>
								<CDBSidebarMenuItem><ProfileIcon /></CDBSidebarMenuItem>
								<div className="dropdown">
									{user && (
										<>
											<button
												className="btn btn-link text-white dropdown-toggle"
												type="button"
												id="dropdownMenuButton"
												data-bs-toggle="dropdown"
												aria-expanded="false"
											>
												{user['username']}
											</button>
										</>
									)}
									<ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
										{/* <li>
											<a className="dropdown-item" href="/profile">
												Profile
											</a>
										</li>
										<li>
											<a className="dropdown-item" href="/settings">
												Settings
											</a>
										</li>
										<li>
											<hr className="dropdown-divider" />
										</li> */}
										<li>
											<a className="dropdown-item" onClick={handleLogout}>
												Logout
											</a>
										</li>
									</ul>
								</div>
							</>
						)}
					</div>
				</CDBSidebarFooter>
			</CDBSidebar>
		</div>
	);
};

export default Sidebarss;
