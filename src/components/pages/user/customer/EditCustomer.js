import React, { useState, useEffect } from 'react';
import { collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Modal } from 'react-bootstrap';
import { db } from '../../../../firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const EditCustomer = ({ show, customers, onClose }) => {
  const [customerName, setCustomerName] = useState(customers.customerName);
  const [customerAddress, setCustomerAddress] = useState(customers.customerAddress);
  const [contactNumber, setContactNumber] = useState(customers.contactNumber);
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

  const updateCustomer = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const collectionRef = collection(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
        userId,
        'customer'
      );

	  const customerId = customers.id;
	  const customerData = {
      customerId: customerId,
        customerName: customerName,
        customerAddress: customerAddress,
        contactNumber: contactNumber,
        updatedtime: serverTimestamp()
      };

	  await updateDoc(doc(collectionRef, customerId), customerData);
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
        <Modal.Title>Edit {customers.customerName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
		<button
          type="button"
          className="btn btn-outline-primary"
          onClick={updateCustomer}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditCustomer