import React, { useState } from 'react';
import { collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Modal } from 'react-bootstrap';
import { db } from '../../../../firebase';

const EditSupplier = ({ show, suppliers, onClose }) => {
  const [supplierName, setSupplierName] = useState(suppliers.supplierName);
  const [supplierAddress, setSupplierAddress] = useState(suppliers.supplierAddress);
  const [contactNumber, setContactNumber] = useState(suppliers.contactNumber);
  const [progresspercent, setProgresspercent] = useState(0);
  const [loading, setLoading] = useState(false);

  const updateSupplier = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const collectionRef = collection(
        db,
        'todos',
        'f3adC8WShePwSBwjQ2yj',
        'basic_users',
        'm831SaFD4oCioO6nfTc7',
        'suppliers',
      );

	  const supplierId = suppliers.id;
	  const supplierData = {
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