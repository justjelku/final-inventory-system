import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { storage } from '../../../../firebase';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

const AddBranch = () => {
  const [supplierId, setSupplierId] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [progresspercent, setProgresspercent] = useState(0);
  const [loading, setLoading] = useState(false);

  const submitSupplier = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const supplierId = uuidv4();

      const collectionRef = collection(
        db,
        'todos',
        'f3adC8WShePwSBwjQ2yj',
        'basic_users',
        'm831SaFD4oCioO6nfTc7',
        'branch',
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
      id="branchModal"
      tabIndex="-1"
      aria-labelledby="branchModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <form className="modal-content" onSubmit={submitSupplier}>
          <div className="modal-header">
            <h5 className="modal-title" id="branchModalLabel">
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
                    Branch Name
                  </label>
                  <input
                    type="text"
                    id="supplierName"
                    className="form-control"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="Branch Name"
                  />
                </div>
                {/* <div className="mb-3">
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
                </div> */}
                <div className="mb-3">
                  <label htmlFor="supplierAddress" className="form-label">
                    Branch Address
                  </label>
                  <input
                    type="text"
                    id="supplierAddress"
                    className="form-control"
                    value={supplierAddress}
                    onChange={(e) => setSupplierAddress(e.target.value)}
                    placeholder="Branch Address"
                  />
                </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            {!loading && (
              <button className="btn btn-primary">Add Branch</button>
            )}
          </div>
        </form>
      </div>
    </div>
)};
        
export default AddBranch;
