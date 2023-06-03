import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import AddSupplier from './AddSupplier';
import { Dropdown } from 'react-bootstrap';
import EditSupplier from './EditSupplier';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const Supplier = () => {
  const [supplier, setSupplier] = useState([]);
  const [showEditSupplierModal, setShowEditSupplierModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
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

  useEffect(() => {
    const getSupplier = async () => {
      const suppliersRef = collection(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
        userId,
        'suppliers'
      );

      try {
        const querySnapshot = await getDocs(suppliersRef);
        const supplierData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setSupplier(supplierData);
      } catch (err) {
        console.log(err);
      }
    };

    if (userId) {
      getSupplier();
    }
  }, [userId]);

  const deleteSupplier = async (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this Supplier?");
    if (confirmation) {
      await deleteDoc(doc(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
        userId,
        'suppliers',
        id
      ));
      window.location.reload();
    }
  };

  const handleEditSupplierModal = (suppliers) => {
    setSelectedSupplier(suppliers);
    setShowEditSupplierModal(true);
  };

  const handleCloseEditSupplierModal = () => {
    setShowEditSupplierModal(false);
  };

  return (
    <>
    <h2 className='mt-3'>Manage Suppliers</h2>
      <div>
        <button
          data-bs-toggle="modal"
          data-bs-target="#supplierModal"
          type="button"
          className="btn btn-info m-3"
        >
          Add Supplier
        </button>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col" className="text-center">
                  Supplier Name
                </th>
                <th scope="col" className="text-center">
                  Contact Number
                </th>
                <th scope="col" className="text-center">
                  Address
                </th>
                <th scope="col" className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {supplier.map((suppliers) => (
                <tr key={suppliers.id}>
                  <td className="text-center justify-content-center">{suppliers.supplierName}</td>
                  <td className="text-center justify-content-center">{suppliers.contactNumber}</td>
                  <td className="text-center justify-content-center">{suppliers.supplierAddress}</td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-primary" id="dropdown-menu">
                          <i className="bi bi-three-dots"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => deleteSupplier(suppliers.id)}>
                            Delete Supplier
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleEditSupplierModal(suppliers)}>
                            Edit Supplier
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedSupplier && (
            <EditSupplier
              show={showEditSupplierModal}
              onClose={handleCloseEditSupplierModal}
              suppliers={selectedSupplier}
            />
          )}
        </div>
      </div>
      <AddSupplier />
    </>
  );
};

export default Supplier;
