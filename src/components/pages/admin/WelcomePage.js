import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { BsGraphUp, BsClock, BsClipboardData, BsCart } from 'react-icons/bs';
import { db } from '../../../firebase';

const WelcomePage = () => {
  const [totalQuantities, setTotalQuantities] = useState(0);
const [stockIn, setStockIn] = useState(0);
const [productOut, setProductOut] = useState([]);
const [totalStockOutQuantity, setTotalStockOutQuantity] = useState(0); // Declare the state variable
const [totalStockInQuantity, setTotalStockInQuantity] = useState(0); 
const [productIn, setProductIn] = useState([]);
const [products, setProducts] = useState([]);
const [userId, setUserId] = useState(null);


  // STATE
  const [showModal, setShowModal] = useState(false)
  const [user, setUser] = useState(null);
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

  const filteredProducts = products.filter((product) =>
    product.productTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = sortField
    ? [...filteredProducts].sort((a, b) => {
      const sortResult = a[sortField].localeCompare(b[sortField]);
      return sortDirection === 'asc' ? sortResult : -sortResult;
    })
    : filteredProducts;

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
      const unsubscribe = onSnapshot(
        query(
          collection(db, 'users', 'qIglLalZbFgIOnO0r3Zu', 'basic_users'),
          where('userId', '==', userId)
        ),
        (querySnapshot) => {
          let userArr = [];
          querySnapshot.forEach((doc) => {
            userArr.push({ id: doc.id, ...doc.data() }); // Include all fields in the object
          });
          setUser(userArr[0]); // Assuming there is only one user document
        }
      );

      return () => unsubscribe();
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
    if (userId) {
      const getProduct = query(
        collection(
          db,
          'users',
          'qIglLalZbFgIOnO0r3Zu',
          'basic_users',
          userId,
          'stock'
        )
      );
      const unsubscribe = onSnapshot(getProduct, (querySnapshot) => {
        let productsArr = [];
        querySnapshot.forEach((doc) => {
          productsArr.push({ id: doc.id, productTitle: doc.productTitle, ...doc.data() }); // Include all fields in the object
        });
        setProducts(productsArr);
      });
      return () => unsubscribe();
    }
  }, [setProducts, userId]);

  useEffect(() => {
    if (userId) {
      const getProduct = query(
        collection(
          db,
          'users',
          'qIglLalZbFgIOnO0r3Zu',
          'basic_users',
          userId,
          'stock'
        )
      );
      const unsubscribe = onSnapshot(getProduct, (querySnapshot) => {
        let productsArr = [];
        let totalQuantity = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.stock === 'Stock Out') {
            const stockOutQuantity = data.productQuantity || 0;
            totalQuantity += stockOutQuantity;
          }
          productsArr.push({ id: doc.id, productTitle: doc.productTitle, ...data });
        });

        setProductOut(productsArr);
        setTotalStockOutQuantity(totalQuantity); // Update the total stock out quantity
      });

      return () => unsubscribe();
    }
  }, [setProductOut, setTotalStockOutQuantity, userId]);

  useEffect(() => {
    if (userId) {
      const getProduct = query(
        collection(
          db,
          'users',
          'qIglLalZbFgIOnO0r3Zu',
          'basic_users',
          userId,
          'stock'
        )
      );
      const unsubscribe = onSnapshot(getProduct, (querySnapshot) => {
        let productsArr = [];
        let totalQuantity = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.stock === 'Stock In') {
            const stockOutQuantity = data.productQuantity || 0;
            totalQuantity += stockOutQuantity;
          }
          productsArr.push({ id: doc.id, productTitle: doc.productTitle, ...data });
        });

        setProductIn(productsArr);
        setTotalStockInQuantity(totalQuantity); // Update the total stock out quantity
      });

      return () => unsubscribe();
    }
  }, [setProductIn, setTotalStockInQuantity, userId]);

  useEffect(() => {
    const getTotalQuantities = async () => {
      const querySnapshot = await getDocs(collection(db, 'users', 'qIglLalZbFgIOnO0r3Zu', 'basic_users', userId, 'products'));
      let total = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.productQuantity) {
          total += parseInt(data.productQuantity);
        }
      });
      console.log(`Total quantities: ${total}`);
      setTotalQuantities(total);
    };
    
    if (userId) {
      getTotalQuantities();
    }
  }, [userId]); 

  useEffect(() => {
    const getTotalStockIn = async () => {
      if (selectedProduct && selectedProduct.productId) {
        const querySnapshot = await getDocs(
          collection(
            db,
            'users',
            'qIglLalZbFgIOnO0r3Zu',
            'basic_users',
            userId,
            'products',
            selectedProduct.productId,
            'stock_in'
          )
        );
        let total = 0;
        let zeroQtyCount = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.productQuantity) {
            total += parseInt(data.productQuantity);
          } else {
            zeroQtyCount++;
          }
        });
        console.log(`Total quantities: ${total}`);
        console.log(`Total products with quantity of zero: ${zeroQtyCount}`);
        setStockIn(total);
      }
    };
  
    if (userId) {
      getTotalStockIn();
    }
  }, [userId, selectedProduct]);

  useEffect(() => {
    const getTotalProductIn = async () => {
      const querySnapshot = await getDocs(collection(db, 'users', 'qIglLalZbFgIOnO0r3Zu', 'basic_users', userId, 'products'));
      let total = 0;
      let nonZeroQtyCount = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.productQuantity && parseInt(data.productQuantity) > 0) {
          total += parseInt(data.productQuantity);
          nonZeroQtyCount++;
        }
      });
      console.log(`Total quantities: ${total}`);
      console.log(`Total products with quantity greater than zero: ${nonZeroQtyCount}`);
      setProductIn(total);
    };
    
    if (userId) {
      getTotalProductIn();
    }
  }, [userId]);

  useEffect(() => {
		if (userId) {
			const unsubscribe = onSnapshot(
				query(
					collection(db, 'users', 'qIglLalZbFgIOnO0r3Zu', 'basic_users'),
					where('userId', '==', userId)
				),
				(querySnapshot) => {
					let userArr = [];
					querySnapshot.forEach((doc) => {
						userArr.push({ id: doc.id, ...doc.data() }); // Include all fields in the object
					});
					setUser(userArr[0]); // Assuming there is only one user document
				}
			);

			return () => unsubscribe();
		}
	}, [userId]);
  
  
  return (
    <>
    <h2 className='mt-3'>
      Hi, {user && (
        user['first name']
      )}
      (admin user)
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
                      <h5 className="card-title">Total Stocks</h5>
                      <p className="card-text">{totalStockInQuantity+totalStockOutQuantity+productIn}</p>
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
                      <h5 className="card-title">Stock In</h5>
                      <p className="card-text">{totalStockInQuantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
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
                      <h5 className="card-title">Stocks</h5>
                      <p className="card-text">{productIn}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
          placeholder="Search by product title"
        />
        <table className="table table-striped table-hover">
          <thead className='ms-auto'>
            <tr>
              <th scope="col" className="text-center" style={{ width: '200px' }} onClick={() => handleSort('productTitle')}>
                Product Title{' '}
                {sortField === 'productTitle' && (
                  <i className={`bi bi-chevron-${sortDirection === 'asc' ? 'up' : 'down'}`} />
                )}
              </th>
              <th scope="col" className="text-center">Category</th>
              <th scope="col" className="text-center">Color</th>
              <th scope="col" className="text-center">Quantity</th>
              <th scope="col" className="text-center">Size</th>
              <th scope="col" className="text-center">Brand</th>
              <th scope="col" className="text-center">Branch</th>
              <th scope="col" className="text-center">Type</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <tr key={product.id} className={selectedRows.includes(product.id) ? 'selected' : ''} onClick={() => handleRowSelect(product.id)}>
                <td className="text-center justify-content-center">{product.productTitle}</td>
                <td className="text-center justify-content-center">{product.category}</td>
                <td className="text-center justify-content-center">{product.color}</td>
                <td className="text-center justify-content-center">{product.productQuantity} Pairs</td>
                <td className="text-center justify-content-center">{product.productSize}</td>
                <td className="text-center justify-content-center">{product.productBrand}</td>
                <td className="text-center justify-content-center">{product.branch}</td>
                <td className="text-center justify-content-center">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default WelcomePage;
