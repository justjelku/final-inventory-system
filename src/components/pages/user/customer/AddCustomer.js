import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const AddCustomer = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
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

  const submitCustomer = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const customerId = uuidv4();

      const collectionRef = collection(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
        userId,
        'customer'
      );
  
      await addDoc(collectionRef, {
        customerId: customerId,
        customerName: customerName,
        customerAddress: customerAddress,
        contactNumber: contactNumber,
        createdtime: serverTimestamp(),
        updatedtime: serverTimestamp(),
      });
  
      setLoading(false);
      setCustomerName('');
      setCustomerAddress('');
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
      id="customerModal"
      tabIndex="-1"
      aria-labelledby="customerModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <form className="modal-content" onSubmit={submitCustomer}>
          <div className="modal-header">
            <h5 className="modal-title" id="customerModalLabel">
              Add Customer
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
                  <label htmlFor="customerName" className="form-label">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    className="form-control"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer Name"
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
                  <label htmlFor="customerAddress" className="form-label">
                    Customer Address
                  </label>
                  <input
                    type="text"
                    id="customerAddress"
                    className="form-control"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Customer Address"
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
          onClick={submitCustomer}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Customer'}
        </button>
          </div>
        </form>
      </div>
    </div>
)};
        
export default AddCustomer;
