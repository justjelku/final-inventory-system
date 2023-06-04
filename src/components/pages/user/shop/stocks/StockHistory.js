import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { collection, getDocs, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../../../../firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const ProductHistoryModal = ({ show, onClose, product }) => {
  const [productHistory, setProductHistory] = useState([]);
  const [productId, setProductId] = useState(product.productId);
  // const [stockinId, setStockinId] = useState(product.stockinId);
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
		if (userId) {
			const unsubscribe = onSnapshot(
				query(collection(
          db, 
          'users', 
          'qIglLalZbFgIOnO0r3Zu', 
          'basic_users',
          userId, 
          'products', 
          productId, 
          'stock_history',
          )
        ),
				(querySnapshot) => {
					let productData = [];
					querySnapshot.forEach((doc) => {
						productData.push({ id: doc.id, ...doc.data() }); // Include all fields in the object
					});
					setProductHistory(productData); // Assuming there is only one user document
				}
			);

			return () => unsubscribe();
		}
	}, [userId]);


  useEffect(() => {
    const fetchProductHistory = async () => {
      try {
        const collectionRef = collection(
          db, 
          'users', 
          'qIglLalZbFgIOnO0r3Zu', 
          'basic_users',
          userId, 
          'products', 
          productId, 
          'stock_history',
        );

        const querySnapshot = await getDocs(collectionRef);
        const historyData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProductHistory(historyData);
      } catch (error) {
        console.log('Error fetching product history:', error);
      }
    };

    fetchProductHistory();
  }, []);

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Stock History for {product.productTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col">
            <h6>Date</h6>
          </div>
          <div className="col">
            <h6>Quantity</h6>
          </div>
          <div className="col">
            <h6>Supplier</h6>
          </div>
          <div className="col">
            <h6>Type</h6>
          </div>
        </div>
        {productHistory.map((historyItem) => (
          <div className="row" key={historyItem.id}>
            <div className="col">{historyItem.createdtime?.toDate().toLocaleDateString()}</div>
            <div className="col">{historyItem.productQuantity}</div>
            <div className="col">{historyItem.supplier}</div>
            <div className="col">{historyItem.stock}</div>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductHistoryModal;
