import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Dropdown } from 'react-bootstrap';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const Admin = () => {
  const [admin, setAdmin] = useState([]);
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
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
    const getAdmin = async () => {
      const AdminsRef = collection(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
      );

      try {
        const querySnapshot = await getDocs(AdminsRef);
        const adminData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setAdmin(adminData);
      } catch (err) {
        console.log(err);
      }
    };

    if (userId) {
      getAdmin();
    }
  }, [userId]);

  const deleteAdmin = async (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this Admin?");
    if (confirmation) {
      await deleteDoc(doc(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
        id
      ));
      window.location.reload();
    }
  };

  const handleEditAdminModal = (admin) => {
    setSelectedAdmin(admin);
    setShowEditAdminModal(true);
  };

  const handleCloseEditAdminModal = () => {
    setShowEditAdminModal(false);
  };

  return (
    <>
    <h2 className='mt-3'>Manage Users</h2>
      <div>
        <button
          data-bs-toggle="modal"
          data-bs-target="#supplierModal"
          type="button"
          className="btn btn-info m-3"
        >
          Add User
        </button>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col" className="text-center">
                  Email
                </th>
                <th scope="col" className="text-center">
                  Username
                </th>
                <th scope="col" className="text-center">
                  Role
                </th>
                <th scope="col" className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {admin.map((admins) => (
                <tr key={suppliers.id}>
                  <td className="text-center justify-content-center">{admins.email}</td>
                  <td className="text-center justify-content-center">{admins.username}</td>
                  <td className="text-center justify-content-center">{admins.role}</td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-primary" id="dropdown-menu">
                          <i className="bi bi-three-dots"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => deleteAdmin(admins.id)}>
                            Delete User
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleEditAdminModal(admins)}>
                            Edit User
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedAdmin && (
            <EditSupplier
              show={showEditAdminModal}
              onClose={handleCloseEditAdminModal}
              suppliers={selectedAdmin}
            />
          )}
        </div>
      </div>
      <AddAdmin />
    </>
  );
};

export default Admin;
