import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { FaUser } from 'react-icons/fa';
import {
	getDocs,
	collection,
	onSnapshot,
	query,
	where
} from 'firebase/firestore';
import { db } from '../../../../firebase';
import EditProfile from '../profile/EditProfile';

const ProfileTabContent = () => {
	const [userId, setUserId] = useState(null);

	// STATE
	const [showModal, setShowModal] = useState(false);
	const [user, setUser] = useState([]);
	const [photo, setPhoto] = useState(null);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

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

	useEffect(() => {
		if (userId) {
			const unsubscribe = onSnapshot(
				query(collection(db, 'users', 'qIglLalZbFgIOnO0r3Zu', 'basic_users', userId, 'profilePhoto')),
				(querySnapshot) => {
					let userPhoto = [];
					querySnapshot.forEach((doc) => {
						userPhoto.push({ id: doc.id, ...doc.data() }); // Include all fields in the object
					});
					setPhoto(userPhoto[0]); // Assuming there is only one user document
				}
			);

			return () => unsubscribe();
		}
	}, [userId]);

	const updateProfile = (e) => {
		e.preventDefault();
		// Add code here to update the profile
	};

	return (
		<div>
			{user && (
				<>
					<EditProfile
						user={user}
						photo={photo}
						id={userId}
						updateProfile={updateProfile}
						firstName={firstName}
						setFirstName={setFirstName}
						lastName={lastName}
						setLastName={setLastName}
						username={username}
						setUsername={setUsername}
						email={email}
						setEmail={setEmail}
						password={password}
						setPassword={setPassword}
					/>
				</>
			)}
		</div>
	);
};

export default ProfileTabContent;
