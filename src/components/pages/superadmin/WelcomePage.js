import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { collection, onSnapshot, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { BsGraphUp, BsClock, BsClipboardData, BsCart } from 'react-icons/bs';
import { db } from '../../../firebase';

const WelcomePage = () => {
  const [totalQuantities, setTotalQuantities] = useState(0);
const [stockIn, setStockIn] = useState(0);
const [productOut, setProductOut] = useState([]);
const [userCount, setUserCount] = useState(0); // Declare the state variable
const [adminCount, setAdminCount] = useState(0); 
const [productIn, setProductIn] = useState([]);
const [products, setProducts] = useState([]);
const [userId, setUserId] = useState(null);


  // STATE
  const [showModal, setShowModal] = useState(false)
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [photo, setPhoto] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRowSelect = (rowId) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(rowId)) {
        return prevSelectedRows.filter((id) => id !== rowId);
      } else {
        return [...prevSelectedRows, rowId];
      }
    });
  };

  const filteredUsers = users.filter((admin) =>
  admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = sortField
    ? [...filteredUsers].sort((a, b) => {
      const sortResult = a[sortField].localeCompare(b[sortField]);
      return sortDirection === 'asc' ? sortResult : -sortResult;
    })
    : filteredUsers;

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
		if (userId) {
		  const getUserData = async () => {
			try {
			  const docRef = doc(db, 'users', 'qIglLalZbFgIOnO0r3Zu');
			  const docSnap = await getDoc(docRef);
			  if (docSnap.exists()) {
				setUser({ id: docSnap.id, ...docSnap.data() });
			  } else {
				console.log('Document not found!');
			  }
			} catch (error) {
			  console.error('Error getting document:', error);
			}
		  };
	  
		  getUserData();
		}
	  }, [userId]);

  useEffect(() => {
    if (userId) {
      const unsubscribe = onSnapshot(
        query(collection(db, 'users', 'qIglLalZbFgIOnO0r3Zu', 'basic_users', userId, 'profilePhoto')),
        (querySnapshot) => {
          let userPhoto = [];
          querySnapshot.forEach((doc) => {
            userPhoto.push({ id: doc.id, ...doc.data() }); // Include all fields in the object
          });
          setPhoto(userPhoto[0]); // Assuming there is only one user document
        }
      );

      return () => unsubscribe();
    }
  }, [userId]);


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
        setUsers(adminData);
      } catch (err) {
        console.log(err);
      }
    };

    if (userId) {
      getAdmin();
    }
  }, [userId]);

  useEffect(() => {
    const getAdminCount = async () => {
      const AdminsRef = collection(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
      );
  
      try {
        const querySnapshot = await getDocs(AdminsRef);
        const adminData = querySnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .filter((user) => user.role === 'admin'); // Filter the users with the role field 'admin'
        const adminCount = adminData.length; // Get the total count of admin users
        console.log('Total number of admin users:', adminCount);
        setAdminCount(adminCount);
      } catch (err) {
        console.log(err);
      }
    };
  
    if (userId) {
      getAdminCount();
    }
  }, [userId]);

  useEffect(() => {
    const getAdminCount = async () => {
      const AdminsRef = collection(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
      );
  
      try {
        const querySnapshot = await getDocs(AdminsRef);
        const adminData = querySnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .filter((user) => user.role === 'basic'); // Filter the users with the role field 'admin'
        const userCount = adminData.length; // Get the total count of admin users
        console.log('Total number of admin users:', userCount);
        setUserCount(userCount);
      } catch (err) {
        console.log(err);
      }
    };
  
    if (userId) {
      getAdminCount();
    }
  }, [userId]);
  
  
  
  return (
    <>
    <h2 className='mt-3'>
      Hi, {user && (
        user.username
      )}
      (super admin user)
    </h2>
    <div className="container mt-auto m-auto justify-content-center">
      <div className="row">
        <div className="col-lg-15">
          <div className="row">
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <BsGraphUp className="fs-5 me-3 text-primary" />
                    <div>
                      <h5 className="card-title">Admin Users</h5>
                      <p className="card-text">{adminCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <BsClock className="fs-2 me-3 text-primary" />
                    <div>
                      <h5 className="card-title">Basic Users</h5>
                      <p className="card-text">{userCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <BsClipboardData className="fs-2 me-3 text-primary" />
                    <div>
                      <h5 className="card-title">Stock Out</h5>
                      <p className="card-text">{totalStockOutQuantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <BsCart className="fs-2 me-3 text-primary" />
                    <div>
                      <h5 className="card-title">Product In</h5>
                      <p className="card-text">{productIn}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
    <h2>Recent Activities</h2>
    <div className="table-responsive">
        <input
          type="search"
          className="form-control me-3"
          aria-label="Search"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search User"
        />
        <table className="table table-striped table-hover">
          <thead className='ms-auto'>
            <tr>
              <th scope="col" className="text-center" style={{ width: '200px' }} onClick={() => handleSort('email')}>
                Email{' '}
                {sortField === 'email' && (
                  <i className={`bi bi-chevron-${sortDirection === 'asc' ? 'up' : 'down'}`} />
                )}
              </th>
              <th scope="col" className="text-center">UserId</th>
              <th scope="col" className="text-center">Username</th>
              <th scope="col" className="text-center">Role</th>
              {/* <th scope="col" className="text-center">Data Created</th> */}
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((admin) => (
              <tr key={admin.id} className={selectedRows.includes(admin.id) ? 'selected' : ''} onClick={() => handleRowSelect(admin.id)}>
                <td className="text-center justify-content-center">{admin.email}</td>
                <td className="text-center justify-content-center">{admin.userId}</td>
                <td className="text-center justify-content-center">{admin.username}</td>
                <td className="text-center justify-content-center">{admin.role}</td>
                {/* <td className="text-center justify-content-center">{admin.createdAt}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default WelcomePage;
