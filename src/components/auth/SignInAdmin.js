import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate, NavLink, Link } from 'react-router-dom';
import SignUpPage from './SignUp';
import { useAuth } from '../../context/AuthContext';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import {
    query,
    getDocs,
    collection,
    where,
} from "firebase/firestore";
import { db } from '../../firebase';

const SignInAdmin = () => {
    const navigate = useNavigate();
    const { signInAdmin, signInWithGoogle } = useAuth();
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showSignUpModal, setShowSignUpModal] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();

        // Perform form validation
        if (!email || !password) {
            setError('Please fill in all the fields.');
            return;
        }

        setError('');

        try {
            const user = await signInAdmin(email, password);
            const userDocRef = await db
                .collection('users')
                .doc('qIglLalZbFgIOnO0r3Zu')
                .get();

            if (userDocRef.exists) {
                // Check user role and navigate accordingly
                const userRole = userDocRef.data().role;
                if (userRole === 'superAdmin') {
                    navigate('/superadmin/home');
                } else {
                    navigate('/signInAdmin');
                }
            } else {
                setError('User not found. Please check your email or sign up.');
            }
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                setError('User not found. Please check your email or sign up.');
            } else if (error.code === 'auth/wrong-password') {
                setError('Incorrect password. Please try again.');
            } else {
                setError(error.message);
                console.log(error.message);
            }
        }
    };


    const signinWithGoogle = async (e) => {
        e.preventDefault();
        await signInWithGoogle(email, password);
        navigate('/');
    };



    return (
        <div className="container">
            <img
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
            />
            <header className="text-center">
                <h1>Shoe Inventory System</h1>
            </header>
            <div className="row justify-content-center mt-5">
                <div className="col-md-6 col-lg-4">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center">Sign In as Admin</h3>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <form onSubmit={handleSignIn}>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button className="btn btn-primary" variant="primary" type="submit">
                                        Sign In
                                    </Button>
                                    <div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInAdmin;
