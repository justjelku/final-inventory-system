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
  const [supplierId, setSupplierId] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
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

  const submitSupplier = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const supplierId = uuidv4();

      const collectionRef = collection(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
        userId,
        'suppliers'
      );

      await addDoc(collectionRef, {
        supplierId: supplierId,
        supplierName: supplierName,
        supplierAddress: supplierAddress,
        contactNumber: contactNumber,
        createdtime: serverTimestamp(),
        updatedtime: serverTimestamp(),
      });

      setLoading(false);
      setSupplierName('');
      setSupplierAddress('');
      setContactNumber('');
      window.location.reload();
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };


  return (
    <div
      className="modal fade"
      id="supplierModal"
      tabIndex="-1"
      aria-labelledby="supplierModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <form className="modal-content" onSubmit={submitSupplier}>
          <div className="modal-header">
            <h5 className="modal-title" id="supplierModalLabel">
              Add Branch
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
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={submitSupplier}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default AddSupplier;
