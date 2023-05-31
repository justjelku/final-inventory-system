import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { Spinner } from 'react-bootstrap';

const firebaseConfig = {
	apiKey: "AIzaSyDoH11PS0y0rAm3koscH3VQNlkmv26bwuY",
	authDomain: "my-anonymity-app.firebaseapp.com",
	databaseURL: "https://my-anonymity-app-default-rtdb.firebaseio.com",
	projectId: "my-anonymity-app",
	storageBucket: "my-anonymity-app.appspot.com",
	messagingSenderId: "149998370320",
	appId: "1:149998370320:web:038ecbe5e259727b501495"
};
// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const authToken = await userCredential.user.getIdToken(); // Get the authentication token
		const userDoc = await firebase.firestore()
			.collection("users")
			.doc("qIglLalZbFgIOnO0r3Zu")
			.collection("basic_users")
			.doc(userCredential.user.uid)
			.get();

		if (userDoc.exists) {
			setUser({
				uid: user.uid,
				email: user.email,
				role: 'basic'
			});
			return null;
		}
		// Check if the user exists in the sub-collection
		if (!userDoc.exists) {
			console.log("User does not exist in the sub-collection");
			return null;
		}

		// Set the user state to the authenticated user
		setUser(userCredential.user);
		return userCredential.user;
	} catch (error) {
		console.error(error);
		return null;
	}
}

  const createUser = async (firstName, lastName, username, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
	  const authToken = await userCredential.user.getIdToken(); // Get the authentication token
      const uid = userCredential.user.uid;

      await firestore.collection("users").doc(uid).set({
        uid: uid,
        role: 'basic',
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        signedInAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      setUser({
        uid: uid,
        email: email,
        role: 'basic'
      });

      return userCredential;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          role: 'basic'
        });
      } else {
        setUser(null);
      }
      setLoading(false); // Set loading to false once the authentication state is determined
    });

    return () => unsubscribe();
  }, []);
  

  useEffect(() => {
	const unsubscribe = onAuthStateChanged(auth, (user) => {
	  setUser(user);
	  if (user) {
		user.getIdToken().then((authToken) => {
		  localStorage.setItem('authToken', authToken); // Store the authentication token
		});
	  } else {
		localStorage.removeItem('authToken'); // Remove the authentication token
	  }
	});
  
	return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, createUser, logout }}>
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh', // Adjust the height as needed
          }}
        >
                <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>

        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
