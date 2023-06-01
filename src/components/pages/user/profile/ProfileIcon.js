import React, { createContext, useContext, useState, useEffect } from 'react';
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

const ProfileIcon = () => {
	const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
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

  return (
	<div className="d-flex justify-content-centerr">
		{photo && photo['profileUrl'] ? (
            <img
              src={photo['profileUrl']}
              alt="Profile"
            //   style={{ maxWidth: '100%', backgroundColor: 'white' }}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <FaUser size={32} />
          )}
	</div>
  )
}

export default ProfileIcon