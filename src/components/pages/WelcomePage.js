import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { FaUser } from 'react-icons/fa';
import {
  getDocs,
  collection,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { BsGraphUp, BsClock, BsClipboardData, BsCart } from 'react-icons/bs';

const WelcomePage = () => {
  const [totalQuantities, setTotalQuantities] = useState(null);
  const [stockIn, setStockIn] = useState(null);
  const [productOut, setProductOut] = useState(null);
  const [productIn, setProductIn] = useState(null);
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);

  // STATE
  const [showModal, setShowModal] = useState(false)
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);

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
          'products'
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
      const querySnapshot = await getDocs(collection(db, 'users', 'qIglLalZbFgIOnO0r3Zu', 'basic_users', userId, 'stock_in'));
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
    };
    
    if (userId) {
      getTotalStockIn();
    }
  }, [userId]);

  useEffect(() => {
    const getTotalProductOut = async () => {
      const querySnapshot = await getDocs(collection(db, 'users', 'qIglLalZbFgIOnO0r3Zu', 'basic_users', userId, 'stock_out'));
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
      setProductOut(total);
    };
    
    if (userId) {
      getTotalProductOut();
    }
  }, [userId]);

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
  
  
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="row">
            <div className="col-md-6">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <BsGraphUp className="fs-5 me-3 text-primary" />
                    <div>
                      <h5 className="card-title">Total Quantities</h5>
                      <p className="card-text">{totalQuantities}</p>
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
                      <p className="card-text">{stockIn}</p>
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
                      <h5 className="card-title">Product Out</h5>
                      <p className="card-text">{productOut}</p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
