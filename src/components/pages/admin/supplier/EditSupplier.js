import React, { useState, useEffect } from 'react';
import { collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Modal } from 'react-bootstrap';
import { db } from '../../../../firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const EditSupplier = ({ show, suppliers, onClose }) => {
  const [supplierName, setSupplierName] = useState(suppliers.supplierName);
  const [supplierAddress, setSupplierAddress] = useState(suppliers.supplierAddress);
  const [contactNumber, setContactNumber] = useState(suppliers.contactNumber);
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

  const updateSupplier = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const collectionRef = collection(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
        userId,
        'suppliers'
      );

      const supplierId = suppliers.id;
      const supplierData = {
        supplierId: supplierId,
        supplierName: supplierName,
        supplierAddress: supplierAddress,
        contactNumber: contactNumber,
        updatedtime: serverTimestamp()
      };

      await updateDoc(doc(collectionRef, supplierId), supplierData);
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
        <Modal.Title>Edit {suppliers.supplierName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="supplierName" className="form-label">
            Supplier Name
          </label>
          <input
            type="text"
            id="supplierName"
            className="form-control"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            placeholder="Supplier Name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contact" className="form-label">
            Contact Number
          </label>
          <input
            type="number"
            id="contact"
            className="form-control"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="09123456789"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="supplierAddress" className="form-label">
            Supplier Address
          </label>
          <input
            type="text"
            id="supplierAddress"
            className="form-control"
            value={supplierAddress}
            onChange={(e) => setSupplierAddress(e.target.value)}
            placeholder="Supplier Address"
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
          onClick={updateSupplier}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditSupplier