import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { collection, getDocs, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../../../../firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import html2pdf from 'html2pdf.js';

const ProductHistoryModal = ({ show, onClose, product }) => {
  const [productHistory, setProductHistory] = useState([]);
  const [productId, setProductId] = useState(product.productId);
  const [productTitle, setProductTitlte] = useState(product.productTitle);
  const [quantity, setQuantity] = useState(product.productQuantity);
  const [branch, setBranch] = useState(product.branch);
  const [userId, setUserId] = useState(null);
  const modalRef = useRef(null);

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
          collection(
            db,
            'users',
            'qIglLalZbFgIOnO0r3Zu',
            'basic_users',
            userId,
            'products',
            productId,
            'stock_history'
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
          'stock_history'
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

  const getTotalQuantity = () => {
    let totalQuantity = 0;
    productHistory.forEach((historyItem) => {
      totalQuantity += historyItem.productQuantity;
    });
    return totalQuantity;
  };

  const getTotalStockOut = () => {
    let totalQuantity = 0;
    productHistory.forEach((historyItem) => {
      if (historyItem.stock === 'Stock Out') {
        totalQuantity += historyItem.productQuantity;
      }
    });
    return totalQuantity;
  };
  

  const getTotalStockIn = () => {
    let totalQuantity = 0;
    productHistory.forEach((historyItem) => {
      if (historyItem.stock === 'Stock In') {
        totalQuantity += historyItem.productQuantity;
      }
    });
    return totalQuantity;
  };
  

  const handleExport = () => {
    const modalContent = document.getElementById('modalContent');
    html2pdf().from(modalContent).save('stockcard.pdf');
  };
  
 
  

  return (
    <Modal show={show} onHide={onClose} size="lg" ref={modalRef}>
      <Modal.Header closeButton>
        <Modal.Title>Stock Card for {product.productTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body id="modalContent">
        <div>
          <strong>Product Name:</strong> {productTitle}
        </div>
        <div>
          <strong>Product ID:</strong> {productId}
        </div>
        <p>
          <strong>Current Stocks:</strong> {quantity} pairs
        </p>

        <div></div>
        <div className="row">
          <div className="col">
            <h6>Date Started</h6>
          </div>
          <div className="col">
            <h6>Date Ended</h6>
          </div>
          <div className="col">
            <h6>Supplier</h6>
          </div>
          <div className="col">
            <h6>Quantity</h6>
          </div>
          <div className="col">
            <h6>Branch</h6>
          </div>
          <div className="col">
            <h6>Type</h6>
          </div>
        </div>
        {productHistory.map((historyItem) => (
          <div className="row" key={historyItem.id}>
            <div className="col">{historyItem.createdtime?.toDate().toLocaleDateString()}</div>
            <div className="col">{historyItem.updatedtime?.toDate().toLocaleDateString()}</div>
            <div className="col">{historyItem.supplier}</div>
            <div className="col">{historyItem.productQuantity} pairs</div>
            <div className="col">{historyItem.branch}</div>
            <div className="col">{historyItem.stock}</div>
          </div>
        ))}
        <p></p>
        <div className="row">
          <div className="col">
            <h6>Stock In</h6>
          </div>
          <div className="col"></div>
          <div className="col">{getTotalStockIn()} pairs</div>
          <div className="col"></div>
          <div className="col"></div>
        </div>
        <div className="row">
          <div className="col">
            <h6>Stock Out</h6>
          </div>
          <div className="col"></div>
          <div className="col">{getTotalStockOut()} pairs</div>
          <div className="col"></div>
          <div className="col"></div>
        </div>
        <div className="row">
          <div className="col">
            <h6>Total Stock</h6>
          </div>
          <div className="col"></div>
          <div className="col">{getTotalQuantity()} pairs</div>
          <div className="col"></div>
          <div className="col"></div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
        <button className="btn btn-primary" onClick={handleExport}>
          Print as PDF
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductHistoryModal;
