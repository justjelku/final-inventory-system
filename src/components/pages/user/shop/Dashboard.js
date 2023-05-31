import React, { useState, useEffect } from 'react';
import ChartComponent from './ChartComponent'
import { db } from '../../../../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import EditProduct from './EditTodo';
import StockOut from './stocks/StockOut';
import StockIn from './stocks/StockIn';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [showStockOut, setShowStockOut] = useState(false);

  const toggleStockOut = () => {
    setShowStockOut(!showStockOut);
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

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-start pt-3 pb-2 mb-3 border-bottom m-10">
        <h1 className="h2">Dashboard</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button type="button" className="btn btn-sm btn-outline-secondary">
              Share
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary">
              Export
            </button>
          </div>
          <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
            <span data-feather="calendar"></span>
            This week
          </button>
        </div>
      </div>
      <ChartComponent />
      {/* <canvas className="my-4 w-100" id="myChart" width="900" height="380"></canvas> */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className='ms-auto'>
            <tr>
              <th scope="col" className="text-center">Image</th>
              <th scope="col" className="text-center " style={{ width: '200px' }}>Product Title</th>
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
            {products.map((product) => (
              <tr key={product.id}>
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
                    {showStockOut && (
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
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-danger m-1"
                      onClick={toggleStockOut}
                    >
                      {showStockOut ? 'Hide Stock Out' : 'Show Stock Out'}
                    </button>
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
