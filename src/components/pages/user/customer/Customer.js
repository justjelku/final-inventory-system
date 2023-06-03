import React, { useState, useEffect } from 'react'
import { db } from '../../../../firebase'
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'
import AddCustomer from './AddCustomer'
import { Dropdown } from 'react-bootstrap';
import EditCustomer from './EditCustomer';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const Customer = () => {
  const [customer, setCustomer] = useState([])
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
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
    const getCustomer = async () => {
      const branchRef = collection(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
        userId,
        'customer'
      );

      try {
        const querySnapshot = await getDocs(branchRef);
        const customerData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setCustomer(customerData);
      } catch (err) {
        console.log(err);
      }
    };

    if (userId) {
      getCustomer();
    }
  }, [userId]);

	// Delete todo
	const deleteCustomer = async (id) => {
		window.confirm("Are you sure you want to delete this Branch?")
		await deleteDoc(doc(
      db,
      'users',
      'qIglLalZbFgIOnO0r3Zu',
      'basic_users',
      userId,
      'customer',
      id
    ));
		window.location.reload();
	};

  const handleEditCustomerModal = (customers) => {
    setSelectedCustomer(customers);
    setShowEditCustomerModal(true);
  };

  const handleCloseEditCustomerModal = () => {
    setShowEditCustomerModal(false);
  };

  return (
    <>
    <h2 className='mt-3'>Manage Customers</h2>
      <div>
        <button
          data-bs-toggle="modal"
          data-bs-target="#customerModal"
          type="button"
          className="btn btn-info m-3">Add Customer
        </button>
        <div className="table-responsive">
          {/* <input
          type="search"
          className="form-control me-3"
          aria-label="Search"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by product title"
        /> */}
          <table className="table table-striped table-hover">
            <thead className='ms-auto'>
              <tr>
                {/* <th scope="col" className="text-center" style={{ width: '200px' }} onClick={() => handleSort('productTitle')}>
                Product Title{' '}
                {sortField === 'productTitle' && (
                  <i className={`bi bi-chevron-${sortDirection === 'asc' ? 'up' : 'down'}`} />
                )}
              </th> */}
                <th scope="col" className="text-center">Customer Name</th>
                <th scope="col" className="text-center">Contact Number</th>
                <th scope="col" className="text-center">Address</th>
                <th scope="col" className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customer.map((customers) => (
                <tr key={customers.id}>
                  <td className="text-center justify-content-center">{customers.customerName}</td>
                  <td className="text-center justify-content-center">{customers.contactNumber}</td>
                  <td className="text-center justify-content-center">{customers.customerAddress}</td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-primary" id="dropdown-menu">
                          <i className="bi bi-three-dots"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => deleteCustomer(customers.id)}>
                            Delete Customer
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleEditCustomerModal(customers)}>
                          Edit Customer
                        </Dropdown.Item>
                        {/* <Dropdown.Item onClick={() => handleStockOutModal(product)}>
                          Stock Out
                        </Dropdown.Item> */}
                        </Dropdown.Menu>
                      </Dropdown>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedCustomer && (
          <EditCustomer
            show={showEditCustomerModal}
            onClose={handleCloseEditCustomerModal}
            customers={selectedCustomer}
          />
        )}
        </div>
      </div>
      <AddCustomer />
    </>
  )
}

export default Customer