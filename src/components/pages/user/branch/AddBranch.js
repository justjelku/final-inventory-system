import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const AddBranch = () => {
  const [branchName, setBranchName] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
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

  const submitBranch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const branchId = uuidv4();

      const collectionRef = collection(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
        userId,
        'branch'
      );


      await addDoc(collectionRef, {
        branchId: branchId,
        branchName: branchName,
        branchAddress: branchAddress,
        createdtime: serverTimestamp(),
        updatedtime: serverTimestamp(),
      });

      setLoading(false);
      setBranchName('');
      setBranchAddress('');
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
        <form className="modal-content" onSubmit={submitBranch}>
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
              <label htmlFor="branchName" className="form-label">
                Branch Name
              </label>
              <input
                type="text"
                id="branchName"
                className="form-control"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="Branch Name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="branchAddress" className="form-label">
                Branch Address
              </label>
              <input
                type="text"
                id="branchAddress"
                className="form-control"
                value={branchAddress}
                onChange={(e) => setBranchAddress(e.target.value)}
                placeholder="Branch Address"
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
              onClick={submitBranch}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Branch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default AddBranch;
