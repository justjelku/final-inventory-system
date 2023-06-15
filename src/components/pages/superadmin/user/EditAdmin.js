import React, { useState, useEffect } from 'react';
import { collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Modal } from 'react-bootstrap';
import { db } from '../../../../firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const EditAdmin = ({ show, admins, onClose }) => {
  const [firstName, setFirstName] = useState(admins.firstName);
  const [lastName, setLastName] = useState(admins.lastName);
  const [email, setEmail] = useState(admins.email);
  const [username, setUsername] = useState(admins.username);
  const [role, setRole] = useState(admins.role);
  const [status, setStatus] = useState(admins.enabled);
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

  const updateAdmin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const collectionRef = collection(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
        userId,
      );

      const adminId = admins.id;
      const adminData = {
        userId: adminId,
        'first name' : firstName,
        'last name' : lastName,
        email: email,
        username: username,
        enabled: status,
        role: role,
        updatedtime: serverTimestamp()
      };

      await updateDoc(doc(collectionRef, adminId), adminData);
      onClose();
      window.location.reload();
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit {admins.email}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={updateAdmin}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditAdmin
