import React, { useState, useEffect } from 'react';
import ChartComponent from './ChartComponent'
import { db } from '../../../../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import EditProduct from './EditTodo';
import StockOut from './stocks/StockOut';
import StockIn from './stocks/StockIn';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showStockOutMap, setShowStockOutMap] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRows, setSelectedRows] = useState([]);

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

  const toggleStockOut = (productId) => {
    setShowStockOutMap((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const collectionRef = collection(
    db,
    'todos',
    'f3adC8WShePwSBwjQ2yj',
    'basic_users',
    'm831SaFD4oCioO6nfTc7',
    'products'
  );

  useEffect(() => {
    const getProduct = async () => {
      await getDocs(collectionRef)
        .then((product) => {
          let productData = product.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setProducts(productData);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getProduct();
  }, []);

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, 'todos', 'f3adC8WShePwSBwjQ2yj', 'basic_users', 'm831SaFD4oCioO6nfTc7', 'products', id));
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
      {/* <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-start pt-3 pb-2 mb-3 border-bottom m-10">
        <h1 className="h2">Dashboard</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleShare}>
              Share
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleExport}>
              Export
            </button>
          </div>
          <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
            <span data-feather="calendar"></span>
            Select date
          </button>
        </div>
      </div> */}
      <ChartComponent />
      {/* <canvas className="my-4 w-100" id="myChart" width="900" height="380"></canvas> */}
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
              <th scope="col" className="text-center">Image</th>
              <th scope="col" className="text-center" style={{ width: '200px' }} onClick={() => handleSort('productTitle')}>
                Product Title{' '}
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
                <td className="text-center justify-content-center">{product.barcode}</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <StockIn
                      product={{
                        productTitle: product.productTitle,
                        productSize: product.productSize,
                        productQuantity: product.productQuantity,
                        color: product.color,
                        category: product.category,
                        branch: product.branch,
                        productBrand: product.productBrand,
                        sizeSystem: product.sizeSystem,
                        productDetails: product.productDetails,
                        productPrice: product.productPrice,
                        productImage: product.productImage,
                      }}
                      id={product.id}
                    />
                    <StockOut
                      product={{
                        productTitle: product.productTitle,
                        productSize: product.productSize,
                        productQuantity: product.productQuantity,
                        color: product.color,
                        category: product.category,
                        branch: product.branch,
                        productBrand: product.productBrand,
                        sizeSystem: product.sizeSystem,
                        productDetails: product.productDetails,
                        productPrice: product.productPrice,
                        productImage: product.productImage,
                      }}
                      id={product.id}
                    />
                    {/* {showStockOutMap[product.id] && (
                      
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-danger m-1"
                      onClick={() => toggleStockOut(product.id)}
                    >
                      {showStockOutMap[product.id] ? 'Hide Stock Out' : 'Show Stock Out'}
                    </button> */}
                    {/* <button
                      type="button"
                      className="btn btn-outline-danger ms-2"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
