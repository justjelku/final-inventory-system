import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { storage } from '../../../../firebase';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

const AddSupplier = () => {
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [progresspercent, setProgresspercent] = useState(0);
  const [loading, setLoading] = useState(false);
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

  const submitAdmin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const adminId = uuidv4();

      const collectionRef = collection(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
      );

      await addDoc(collectionRef, {
        userId: adminId,
        'first name': firstName,
        'last name': lastName,
        email: email,
        username: username,
        role: role,
        enabled: status,
        createdtime: serverTimestamp(),
        updatedtime: serverTimestamp(),
      });

      setLoading(false);
      setFirstName('');
      setLastName('');
      setUsername('');
      setEmail('');
      setRole('');
      setStatus('');
      window.location.reload();
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };


  return (
    <div
      className="modal fade"
      id="adminModel"
      tabIndex="-1"
      aria-labelledby="adminModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <form className="modal-content" onSubmit={submitAdmin}>
          <div className="modal-header">
            <h5 className="modal-title" id="adminModalLabel">
              Add New User Admin
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Email
          </label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="text"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">
            Role
          </label>
          <input
            type="text"
            id="role"
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <input
            type="text"
            id="status"
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Status"
          />
        </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={submitAdmin}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default AddSupplier;
