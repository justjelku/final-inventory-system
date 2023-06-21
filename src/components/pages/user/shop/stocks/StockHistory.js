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
  const [productId] = useState(product.productId);
  const [productTitle] = useState(product.productTitle);
  const [quantity] = useState(product.productQuantity);
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
          const historyData = querySnapshot.docs
            .filter((doc) => doc.data()) // Filter docs by productId
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => a.createdAt - b.createdAt); // Sort in descending order based on createdAt field
          setProductHistory(historyData); // Assuming there is only one user document
        }
      );

      return () => unsubscribe();
    }
  }, []);

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
        const historyData = querySnapshot.docs
          .filter((doc) => doc.data()) // Filter docs by productId
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => b.createdAt - a.createdAt); // Sort in descending order based on createdAt field
        setProductHistory(historyData);
      } catch (error) {
        console.log('Error fetching product history:', error);
      }
    };

    fetchProductHistory();
  }, [productId]);




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
    const options = {
      filename: 'stockcard.pdf',
      orientation: 'landscape' // Set the paper orientation to landscape
    };
    html2pdf().set(options).from(modalContent).save();
  };

  // const sortedProductHistory = [...productHistory].sort((a, b) => {
  //   const dateA = new Date(a.createdAt?.toDate());
  //   const dateB = new Date(b.createdAt?.toDate());
  //   return dateB - dateA; // Sort in descending order based on createdAt field
  // }).reverse(); // Reverse the sorted array to achieve LIFO sorting

  // const lastDate = sortedProductHistory.length > 0 ? sortedProductHistory[0].createdAt : null;
  // const remainingHistory = sortedProductHistory.slice(1);

  const sortedProductHistory = [...productHistory].sort((a, b) => {
    const timeA = new Date(a.createdtime?.toDate());
    const timeB = new Date(b.createdtime?.toDate());
    return timeA - timeB; // Sort in ascending order based on createdtime field
  });

  // const lastDate = sortedProductHistory.length > 0 ? sortedProductHistory[sortedProductHistory.length - 1].createdtime?.toDate() : null;
  // const remainingHistory = sortedProductHistory.slice(0, sortedProductHistory.length - 1);

  return (
    <Modal show={show} onHide={onClose} size="lg" ref={modalRef}>
      {/* <Modal.Header closeButton>
        <Modal.Title>Stock Card for {product.productTitle}</Modal.Title>
      </Modal.Header> */}
      <Modal.Body id="modalContent">
        <h4>
          <strong>Stock Card for {product.productTitle}</strong>
        </h4>
        <div>
          <strong>Product Name:</strong> {productTitle}
        </div>
        <div>
          <strong>Product ID:</strong> {productId}
        </div>
        <div>
          <strong>Category:</strong> {product.category}
        </div>
        <div>
          <strong>Type:</strong> {product.type}
        </div>
        <div>
          <strong>Price:</strong> {product.productPrice}
        </div>
        <div>
          <strong>Color:</strong> {product.color}
        </div>
        <p>
          <strong>Current Stocks:</strong> {quantity} pairs
        </p>

        <div></div>

        <div className="row align-items-center">
          <div className="col">
            <h6>Date Stock</h6>
          </div>
          <div className="col">
            <h6>Supplier</h6>
          </div>
          <div className="col">
            <h6>Quantity</h6>
          </div>
          <div className="col">
            <h6>Balance</h6>
          </div>
          <div className="col">
            <h6>Price</h6>
          </div>
          <div className="col">
            <h6>Branch</h6>
          </div>
          <div className="col">
            <h6>Remark</h6>
          </div>
        </div>

        {productHistory
          .sort((a, b) => {
            const dateA = a.createdtime?.toDate();
            const dateB = b.createdtime?.toDate();
            return dateA - dateB;
          })
          .map((historyItem) => (
            <div className="row border-top align-items-center" key={historyItem.id}>
              <div className="col">
                {historyItem.createdtime?.toDate()?.toLocaleDateString([], {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
                <br />
                {historyItem.createdtime?.toDate()?.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="col">{historyItem.supplier}</div>
              <div className="col">{historyItem.productQuantity} pairs</div>
              <div className="col">{historyItem.balance} pairs</div>
              <div className="col">{historyItem.productPrice}</div>
              <div className="col">{historyItem.branch}</div>
              <div className="col">{historyItem.stock}</div>
            </div>
          ))}



        <p></p>
        {/* <div className="row">
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
        </div> */}
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
