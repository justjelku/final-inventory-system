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
	query,
	where
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
			const unsubscribe = onSnapshot(
				query(
					collection(db, 'users', 'qIglLalZbFgIOnO0r3Zu', 'basic_users'),
					where('userId', '==', userId)
				),
				(querySnapshot) => {
					let userArr = [];
					querySnapshot.forEach((doc) => {
						userArr.push({ id: doc.id, ...doc.data() }); // Include all fields in the object
					});
					setUser(userArr[0]); // Assuming there is only one user document
				}
			);

			return () => unsubscribe();
		}
	}, [userId]);

	const toggleSidebar = () => {
		setSidebarMinimized(!sidebarMinimized);
	};

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
		<div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
			<CDBSidebar textColor="#fff" backgroundColor="#333" className={sidebarMinimized ? 'sidebar-minimized' : ''}>
				<CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
					<a href="/admin/home" className="text-decoration-none" style={{ color: 'inherit' }}>
						Shoe Inventory Admin
					</a> 
				</CDBSidebarHeader>

				<CDBSidebarContent className="sidebar-content">
					<CDBSidebarMenu>
						<NavLink exact to="/admin/home" activeClassName="activeClicked">
							<CDBSidebarMenuItem icon="home">Home</CDBSidebarMenuItem>
						</NavLink>
						<NavLink exact to="/admin/inventory" activeClassName="activeClicked">
							<CDBSidebarMenuItem icon="box">Inventory</CDBSidebarMenuItem>
						</NavLink>
						<NavLink exact to="/admin/stocks" activeClassName="activeClicked">
							<CDBSidebarMenuItem icon="shopping-cart">Stocks</CDBSidebarMenuItem>
						</NavLink>
						{/* <NavLink exact to="/customer" activeClassName="activeClicked">
				<CDBSidebarMenuItem icon="user">Customer</CDBSidebarMenuItem>
			  </NavLink> */}
						<NavLink exact to="/admin/supplier" activeClassName="activeClicked">
							<CDBSidebarMenuItem icon="truck">Supplier</CDBSidebarMenuItem>
						</NavLink>
						<NavLink exact to="/admin/branch" activeClassName="activeClicked">
							<CDBSidebarMenuItem icon="building">Branch</CDBSidebarMenuItem>
						</NavLink>
						{/* <NavLink exact to="/admin/manageuser" activeClassName="activeClicked">
							<CDBSidebarMenuItem icon="building">Manage User</CDBSidebarMenuItem>
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
