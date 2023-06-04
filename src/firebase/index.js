import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { initializeApp } from 'firebase/app';
import {getAuth} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';
import 'firebase/compat/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyDoH11PS0y0rAm3koscH3VQNlkmv26bwuY",
	authDomain: "my-anonymity-app.firebaseapp.com",
	databaseURL: "https://my-anonymity-app-default-rtdb.firebaseio.com",
	projectId: "my-anonymity-app",
	storageBucket: "my-anonymity-app.appspot.com",
	messagingSenderId: "149998370320",
	appId: "1:149998370320:web:038ecbe5e259727b501495"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {auth, db, storage};
// export default firestoreInstance;

