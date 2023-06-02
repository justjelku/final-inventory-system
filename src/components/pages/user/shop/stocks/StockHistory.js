import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../../firebase';

const ProductHistoryModal = ({ show, onClose, product }) => {
  const [productHistory, setProductHistory] = useState([]);

  useEffect(() => {
    const fetchProductHistory = async () => {
      try {
        const collectionRef = collection(
          db,
          'todos',
          'f3adC8WShePwSBwjQ2yj',
          'basic_users',
          'm831SaFD4oCioO6nfTc7',
          'stock'
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
            <h6>Type</h6>
          </div>
        </div>
        {productHistory.map((historyItem) => (
          <div className="row" key={historyItem.id}>
            <div className="col">{historyItem.createdtime?.toDate().toLocaleDateString()}</div>
            <div className="col">{historyItem.productQuantity}</div>
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
