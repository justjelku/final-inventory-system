import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
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

// var admin = require("firebase-admin");

// var serviceAccount = require({
// 	"type": "service_account",
// 	"project_id": "my-anonymity-app",
// 	"private_key_id": "d5a84fc3ead277ecb68651d3d79d834b7d456e7c",
// 	"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCegyfw9Rz2xy5B\nzEEZF40x1t4MgzEllkKWYsKMU+x+n5bbpkrB2XT3WPHGOKWZH88blGT2vosA4a7Q\naUD34aHI2ou5mpOjpFQbTwpbk9nP3x7C+/KltL+Cinq9NWb8DV518Sm20YTjoE3R\nIo/ipMXwAXXu6a4Wpt/rgoOMJrkd0qh2kLYh2x2Xxg5yeHNrtUz2PczuiNMCSD3H\npKqCYGY8YHkKnxiJ0bqC7J06EnCvg4OTm1NjEeOuiZC7I+d4z9aPxhExF09Clqhw\nLgxWmUo3wBoO0XARLlzFE7ZUEpcZfLsdmgpRU9OPa328ge854TL/sndegdq9lCN0\nEP9pSdVlAgMBAAECggEAFiyIbquInjhLJGwzd7702FHTpSdzEsF8K3fBpF9sbWLb\nd9BBk/AyGGnfry18c45gwAhtvptKwa2lxpolZaexefH3QC27VSsnPYdnOQar877Q\nGab6ENaB6yZ+Y1qFlLaKuMVVjbFYktPOyaCOmpNslxWf5EiEkGmkAwOHwxglpuH5\nBNdZPhg2MV2V0T2vxCBOUV9JXeQfgHS9p7SClCPsH39j54ae7pKtF5CX8xPIUapC\nDkrqa4cyUIHlU60HI7Xn1H5d0Q7WxiD8muyAL4CxBhagI3LabxHOFTTGuwg+V0fm\njhm59H9MXjnO/H8Q8aeRf3Q9gMkxiHFyKj3dPbv6TwKBgQDfEfcK6Xv9LSXQBqv9\neBiSG40bxC7uuQKK4eylUIJ6Ulva6WZ5FTWOcLLH2Y6dWAaiGpplvyAxoTVgi/F/\nIo464Pg7A9EIFvOhRABHq6o3tGJ8WTfuABaGspZixk3ynZg28+yPar3kHLwEnkpw\n4BuypZ0okyFkfqelVtjos01GUwKBgQC16X0AtwQoNuFUM6ht/UDSDv0Iki5dxoRv\nhzmaCIfK89Gi6WaloWuBfN7nd4DvBmGX1h7nMj15v1wmrwMxlynouPeqwL/SGLTi\nI4+1Jr3krFbuaVhIE3W/rVXNWAGi2FdhYj92txlWvLYAWBZTlX/+tyRFfY6l6/aI\naHkDB/4OZwKBgHAgKZs0jXxPK0iLcfwwV7lpW95vGGAqYtrIgRj/hPZTW5SH6VhH\njuoQP+0wr/zq+DqXQLCQB3Cq5ZeoADW1euShnGSdoH5+euu+sJ1V7nOdmjuC5Rge\ntzPxpKH1p8yh5pcIuQnFz7lPsDpqDmT6YTHFCWARxKEtALudEd618cu9AoGAZ03F\n9/72tGOeCHQhhPyZr/BlD1X8ULKoiLFRK8EGZGGbvhkveoW1iF5CM04xAQwtpc0p\n1X85XAcorKscdC/0070eoHA/Pm9bYURympv6oH6iC1f1k1DBwG0N2cPNgg27aYki\noycNk60s6fscCrFOc3bLeU75EA50/Tfe6LLEOqcCgYBk9KqVRqxx26Yxwnp31AK7\n0Hk+iLuCTBwy0io4TnO2oVvfuArrbTQEJlWjBrQAOm6eTLvZI5i4UHd8Bgged9FN\nTGzwidLLbpC1zV12mqHjxge3o9pN3hdoylAS26k+cHkubFFJMv3By1/1ckws8rhw\nA0Kg71hks7Sssg6CyO5c4Q==\n-----END PRIVATE KEY-----\n",
// 	"client_email": "firebase-adminsdk-yechu@my-anonymity-app.iam.gserviceaccount.com",
// 	"client_id": "112098141907032603945",
// 	"auth_uri": "https://accounts.google.com/o/oauth2/auth",
// 	"token_uri": "https://oauth2.googleapis.com/token",
// 	"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
// 	"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-yechu%40my-anonymity-app.iam.gserviceaccount.com",
// 	"universe_domain": "googleapis.com"
//   });

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://my-anonymity-app-default-rtdb.firebaseio.com"
// });


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = getStorage();


export {auth, db, storage};
// export default firestoreInstance;

