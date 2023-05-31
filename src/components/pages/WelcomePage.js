import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../../firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
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
        query(
          collection(db, 'users', 'qIglLalZbFgIOnO0r3Zu', 'basic_users', userId, 'profilePhoto'),
        ),
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
    const unsubscribeAuth = firebase.auth().onAuthStateChanged(user => {
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
    <div className="m-3">
      {user && (
          <>
          <h5 className='m-3'> Welcome back, {user['first name']} {user['last name']}</h5>
          </>
        )}
      <div className="row m-3">
        <div className="col-sm-6 col-lg-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body d-flex align-items-center">
              <div className="d-flex align-items-center">
                <div className="dashboard__icon me-2 ">
                  <BsClock size={40}/>
                </div>
                <div className="dashboard__text align-items-center">
                  <h3 className="dashboard__title d-flex align-items-center">Product In</h3>
                  <p className="dashboard__value">{productIn}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3 mb-3">
          <div className="card bg-secondary text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="dashboard__icon me-2">
                  <BsGraphUp size={40}/>
                </div>
                <div className="dashboard__text">
                  <h3 className="dashboard__title">Stock In</h3>
                  <p className="dashboard__value">{stockIn}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="dashboard__icon me-2">
                  <BsCart size={40}/>
                </div>
                <div className="dashboard__text">
                  <h3 className="dashboard__title">Stock Out</h3>
                  <p className="dashboard__value">{productOut}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="dashboard__icon me-2">
                  <BsClipboardData size={40}/>
                </div>
                <div className="dashboard__text">
                  <h3 className="dashboard__title">Total Products</h3>
                  <p className="dashboard__value">{productIn+productOut}</p>
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
