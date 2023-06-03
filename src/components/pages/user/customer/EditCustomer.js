import React, { useState } from 'react';
import { collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Modal } from 'react-bootstrap';
import { db } from '../../../../firebase';

const EditCustomer = ({ show, customers, onClose }) => {
  const [customerName, setCustomerName] = useState(customers.customerName);
  const [customerAddress, setCustomerAddress] = useState(customers.customerAddress);
  const [contactNumber, setContactNumber] = useState(customers.contactNumber);
  const [progresspercent, setProgresspercent] = useState(0);
  const [loading, setLoading] = useState(false);

  const updateCustomer = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const collectionRef = collection(
        db,
        'todos',
        'f3adC8WShePwSBwjQ2yj',
        'basic_users',
        'm831SaFD4oCioO6nfTc7',
        'customer',
      );

	  const customerId = customers.id;
	  const customerData = {
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