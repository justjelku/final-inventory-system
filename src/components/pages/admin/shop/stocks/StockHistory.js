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
          try {
            const historyData = querySnapshot.docs
              .filter((doc) => doc.data()) // Filter docs by productId
              .map((doc) => ({ id: doc.id, ...doc.data() }))
              .sort((a, b) => a.createdtime.toDate().getTime() - b.createdtime.toDate().getTime()); // Sort in ascending order based on createdtime field
            setProductHistory(historyData);
          } catch (error) {
            console.error('Error:', error);
          }
        }
      );
  
      return () => unsubscribe();
    }
  }, [userId, productId]);
  

  const handleExport = () => {
    const modalContent = document.getElementById('modalContent');
    const options = {
      filename: 'stockcard.pdf',
      orientation: 'landscape', // Set the paper orientation to landscape
    };
    html2pdf().set(options).from(modalContent).save();
  };
  
  const sortedProductHistory = [...productHistory].sort((a, b) => {
    const timeA = a.createdtime ? a.createdtime.toDate() : new Date();
    const timeB = b.createdtime ? b.createdtime.toDate() : new Date();
    return timeA - timeB; // Sort in ascending order based on createdtime field
  });
  

  return (
    <Modal show={show} onHide={onClose} size="lg" ref={modalRef}>
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
          <strong>Price by Pair:</strong> ₱{product.productPrice}
        </div>
        <div>
          <strong>Color:</strong> {product.color}
        </div>
        <p>
          <strong>Current Stocks:</strong> {product.balance} pairs
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
            <h6>Total Price</h6>
          </div>
          <div className="col">
            <h6>Branch</h6>
          </div>
          <div className="col">
            <h6>Remark</h6>
          </div>
        </div>
        {sortedProductHistory.map((historyItem) => (
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

        {/* {productHistory.map((historyItem) => (
          <div className="row border-top align-items-center" key={historyItem.id}>
            <div className="col">
              {historyItem.createdtime && (
                <>
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
                </>
              )} */}
            </div>
            <div className="col">{historyItem.supplier}</div>
            <div className="col">{historyItem.productQuantity} pairs</div>
            <div className="col">{historyItem.balance} pairs</div>
            <div className="col">₱{historyItem.productPrice}</div>
            <div className="col">{historyItem.branch}</div>
            <div className="col">{historyItem.stock}</div>
          </div>
        ))}
        <p></p>
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
