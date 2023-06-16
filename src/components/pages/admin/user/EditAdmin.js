import React, { useState, useEffect } from 'react';
import { collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Modal } from 'react-bootstrap';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { db } from '../../../../firebase';

const EditAdmin = ({ show, admins, onClose }) => {
  const [adminUserId, setAdminUserId] = useState(admins.id);
  const [firstName, setFirstName] = useState(admins['first name']);
  const [lastName, setLastName] = useState(admins['last name']);
  const [email, setEmail] = useState(admins.email);
  const [username, setUsername] = useState(admins.username);
  const [role, setRole] = useState(admins.role);
  const [status, setStatus] = useState(admins.enabled);
  const [progresspercent, setProgresspercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribeAuth();
  }, [currentId]);

  const updateAdmin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const collectionRef = collection(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
        currentId,
        'user',
        userId
      );

      const userId = admins.id;

      // Check if firstName is defined, otherwise use an empty string
      const adminData = {
        adminId: currentId,
        userId: userId,
        'first name': firstName || '',
        'last name': lastName,
        email: email,
        username: username,
        enabled: status,
        role: role,
        updatedtime: serverTimestamp()
      };

      await updateDoc(doc(collectionRef, userId), adminData);
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
          <select
            id="role"
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="basic">Basic</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            id="status"
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Status"
          >
            <option value="">Select Status</option>
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
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
