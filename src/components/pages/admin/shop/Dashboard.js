import React, { useState, useEffect } from 'react';
import ChartComponent from './ChartComponent'
import { db } from '../../../../firebase';
import { collection, getDocs, doc, deleteDoc, query, onSnapshot } from 'firebase/firestore';
import StockOut from './stocks/StockOut';
import StockIn from './stocks/StockIn';
import { Dropdown } from 'react-bootstrap';
import ProductHistoryModal from './stocks/StockHistory';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import Barcode from 'react-barcode';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRows, setSelectedRows] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showStockInModal, setShowStockInModal] = useState(false);
  const [showStockOutModal, setShowStockOutModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  const handleShowHistoryModal = (product) => {
    setSelectedProduct(product);
    setShowHistoryModal(true);
  };

  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
  };

  const handleStockInModal = (product) => {
    setSelectedProduct(product);
    setShowStockInModal(true);
  };

  const handleCloseStockInModal = () => {
    setShowStockInModal(false);
  };

  const handleStockOutModal = (product) => {
    setSelectedProduct(product);
    setShowStockOutModal(true);
  };

  const handleCloseStockOutModal = () => {
    setShowStockOutModal(false);
  };


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
      if (userId) {
        const unsubscribe = onSnapshot(
          query(collection(db, 'users', 'qIglLalZbFgIOnO0r3Zu', 'basic_users', userId, 'products')),
          (querySnapshot) => {
            let productData = [];
            querySnapshot.forEach((doc) => {
              productData.push({ id: doc.id, ...doc.data() }); // Include all fields in the object
            });
            setProducts(productData); // Assuming there is only one user document
          }
        );
  
        return () => unsubscribe();
      }
    }, [userId]);

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, 'users', 'qIglLalZbFgIOnO0r3Zu', 'basic_users', userId, 'products', id));
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
  };

  const handleShare = () => {
    const canvas = document.getElementById('myChart');
    const imageURL = canvas.toDataURL('image/png');
    // Replace the share implementation with your preferred method (e.g., sharing via social media library)
    console.log('Sharing the chart:', imageURL);
  };

  const handleExport = () => {
    const canvas = document.getElementById('myChart');
    const imageURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'chart.png';
    link.click();
  };

  return (
    <div>
      <ChartComponent />
      <div className="table-responsive">
        <input
          type="search"
          className="form-control me-3"
          aria-label="Search"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by product title"
        />
        <table className="table table-striped table-hover table-responsive">
          <thead className='ms-auto'>
            <tr>
              <th scope="col" className="text-center">Image</th>
              <th scope="col" className="text-center" onClick={() => handleSort('productTitle')}>
                Product{' '}
                {sortField === 'productTitle' && (
                  <i className={`bi bi-chevron-${sortDirection === 'asc' ? 'up' : 'down'}`} />
                )}
              </th>
              <th scope="col" className="text-center">Category</th>
              <th scope="col" className="text-center">Color</th>
              <th scope="col" className="text-center">Price</th>
              <th scope="col" className="text-center">Quantity</th>
              <th scope="col" className="text-center">Size</th>
              <th scope="col" className="text-center">Brand</th>
              <th scope="col" className="text-center">Branch</th>
              <th scope="col" className="text-center">Barcode</th>
              <th scope="col" className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <tr key={product.id} className={selectedRows.includes(product.id) ? 'selected' : ''} onClick={() => handleRowSelect(product.id)}>
                <td>
                  <img src={product.productImage} alt={product.productTitle} style={{ width: '50px', height: '50px' }} />
                </td>
                <td className="text-center justify-content-center">{product.productTitle}</td>
                <td className="text-center justify-content-center">{product.category}</td>
                <td className="text-center justify-content-center">{product.color}</td>
                <td className="text-center justify-content-center">{product.productPrice}</td>
                <td className="text-center justify-content-center">{product.productQuantity} Pairs</td>
                <td className="text-center justify-content-center">{product.sizeSystem} {product.productSize}</td>
                <td className="text-center justify-content-center">{product.productBrand}</td>
                <td className="text-center justify-content-center">{product.branch}</td>
                <td className="text-center justify-content-center"><Barcode value={product.barcodeId} width={1.2} height={50} />
</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-primary" id="dropdown-menu">
                        <i className="bi bi-three-dots"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleShowHistoryModal(product)}>
                          Stock Card
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleStockInModal(product)}>
                          Stock In
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleStockOutModal(product)}>
                          Stock Out
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedProduct && (
          <ProductHistoryModal
            show={showHistoryModal}
            onClose={handleCloseHistoryModal}
            product={selectedProduct}
          />
        )}
        {selectedProduct && (
          <StockIn
            show={showStockInModal}
            onClose={handleCloseStockInModal}
            product={selectedProduct}
          />
        )}
        {selectedProduct && (
          <StockOut
            show={showStockOutModal}
            onClose={handleCloseStockOutModal}
            product={selectedProduct}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
