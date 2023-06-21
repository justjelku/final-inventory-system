import React, { useState, useEffect } from 'react';
import { collection, getDocs, serverTimestamp, doc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../../../../../firebase';
import { Modal } from 'react-bootstrap';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const StockOut = ({ product, show, onClose }) => {
  const [productId] = useState(product.productId);
  const [barcodeId] = useState(product.barcodeId);
  const [barcodeUrl] = useState(product.barcodeUrl);
  const [qrcodeUrl] = useState(product.qrcodeUrl);
  const [productTitle, setProductTitle] = useState(product.productTitle);
  const [size, setSize] = useState(product.productSize);
  const [quantity, setQuantity] = useState(product.productQuantity);
  const [color, setColor] = useState(product.color);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [category, setCategory] = useState(product.category);
  const [brand, setBrand] = useState(product.productBrand);
  const [sizeSystem] = useState(product.sizeSystem);
  const [details, setDetails] = useState(product.productDetails);
  const [price, setPrice] = useState(product.productPrice);
  const [image, setImage] = useState(product.productImage);
  const [progresspercent, setProgresspercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [setCurrency] = useState('₱');
  const [type, setType] = useState(product.type);
  const [branch, setBranch] = useState(product.branch)
  const [supplier, setSupplier] = useState(product.supplier)
  const [selectedSupplier, setSelectedSupplier] = useState(null);
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

  const getLastProductId = () => {
    const random = Math.floor(Math.random() * 100000);
    const user = firebase.auth().currentUser;
    const userId = user.uid;
    const userPrefix = userId.substring(0, 3);
    return `${userPrefix}${String(random).padStart(5, '0')}`;
  };

  const updateProduct = async () => {
    try {
      setLoading(true);
      const lastProductId = getLastProductId();
      const stockoutId = `2023${userId.substring(0, 6)}${lastProductId.substring(lastProductId.length - 8)}`;

      const collectionRef = collection(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
        userId,
        'products'
      );
      const stockRef = collection(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
        userId,
        'stock'
      );

      // if (parseInt(quantity) > 200) {
      //   alert('Critical alert: Quantity is at the maximum level!');
      //   return;
      // }
      // if (parseInt(quantity) < 50) {
      //   alert('Critical alert: Quantity is at the minimum level!');
      //   return;
      // }
      const productRef = doc(collectionRef, productId);
      const docRef = doc(productRef, 'stock_out', stockoutId);
      const stocksRef = doc(productRef, 'stock_history', stockoutId);
      const stockhistoryRef = doc(stockRef, stockoutId);
      const stockOutData = {
        stockoutId: stockoutId,
        productId: productId,
        userId: userId,
        barcodeId: barcodeId,
        type: type,
        barcodeUrl: barcodeUrl,
        qrcodeUrl: qrcodeUrl,
        productTitle: productTitle,
        balance: parseInt(product.balance) - parseInt(quantity),
        productSize: size,
        productQuantity: parseInt(quantity),
        color: color,
        branch: branch,
        category: category,
        productImage: image,
        stock: 'Stock Out',
        productBrand: brand,
        sizeSystem: sizeSystem,
        productDetails: details,
        productPrice: parseInt(price) * parseInt(quantity),
        supplier: supplier,
        createdtime: serverTimestamp(),
        updatedtime: serverTimestamp()
      };

      const productData = {
        productId: productId,
        userId: userId,
        barcodeId: barcodeId,
        type: type,
        barcodeUrl: barcodeUrl,
        qrcodeUrl: qrcodeUrl,
        productTitle: productTitle,
        balance: parseInt(product.balance) - parseInt(quantity),
        productSize: size,
        productQuantity: parseInt(product.balance),
        color: color,
        branch: branch,
        productImage: image,
        category: category,
        productBrand: brand,
        sizeSystem: sizeSystem,
        productDetails: details,
        productPrice: parseInt(price),
        supplier: branch,
        createdtime: serverTimestamp(),
        updatedtime: serverTimestamp(),
      };

      // if (downloadURL) {
      //   productData.productImage = downloadURL;
      // }

      if ((parseInt(product.balance) - parseInt(quantity)) < 0) {
        alert('Warning! Understock! Current Stock: ' + product.balance);
        setLoading(false);
        return;
      }

      await setDoc(productRef, productData);
      await setDoc(docRef, stockOutData);
      await setDoc(stocksRef, stockOutData);
      await setDoc(stockhistoryRef, stockOutData);
      setLoading(false);
      onClose(); // Close the modal
      // window.location.reload();
    } catch (err) {
      setLoading(false);  
      console.log(err);
    }
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target?.files[0];
    setImage(file);
  };


  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Stock Out for {product.productTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-3">
            {/* <div className="mb-3">
              <label htmlFor="formFileSm" className="form-label">
                Select Image
              </label>
              <input
                className="form-control form-control-sm"
                id="formFileSm"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                readOnly
              />
            </div> */}
            <div className="col">
              {image && typeof image === 'string' ? (
                <div className="d-flex justify-content-center">
                  {/* Display the Firebase URL */}
                  <img src={image} style={{ maxWidth: '100%', backgroundColor: 'white' }} alt="Selected Product" className="img-fluid" />
                </div>
              ) : (
                <div className="d-flex justify-content-center">
                  {/* Display the selected image */}
                  <img src={URL.createObjectURL(image)} style={{ maxWidth: '100%', backgroundColor: 'white' }} alt="Selected Product" className="img-fluid" />
                </div>
              )}
            </div>

          </div>
          <div className="col-md-3">
            <div class='mb-3'>
              <label for="formGroupExampleInput" class="form-label">Product Title</label>
              <input
                type="text"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                className="form-control"
                placeholder="Nike Air Zoom"
                readOnly
              />
            </div>
            <div className="mb-3">
              <label htmlFor="formGroupExampleInput" className="form-label">Size</label>
              <div className="input-group mb-1">
                <input
                  type="text"
                  value={size}
                  onChange={setSize}
                  className="form-control"
                  placeholder="0"
                  aria-label=""
                  readOnly
                />
              </div>
            </div>
            <div class='mb-3'>
              <label for="formGroupExampleInput" class="form-label">Supplier</label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="form-control"
                placeholder=""
                readOnly
              />
            </div>
            {/* <div className="mb-3">
              <label htmlFor="supplier" className="form-label">Supplier</label>
              {supplier.length > 0 ? (
                <select
                  id="supplier"
                  className="form-select"
                  value={selectedSupplier ? selectedSupplier.id : ''}
                  onChange={(e) => {
                    const supplierId = e.target.value;
                    const supplierObj = supplier.find((supplierItem) => supplierItem.id === supplierId);
                    setSelectedSupplier(supplierObj);
                  }}
                >
                  <option value="">Select Supplier</option>
                  {supplier.map((supplierItem) => (
                    <option key={supplierItem.id} value={supplierItem.id}>
                      {supplierItem.supplierName}
                    </option>
                  ))}
                </select>
              ) : (
                <p>Loading suppliers...</p>
              )}
            </div> */}
          </div>
          <div className='col-md-3'>
            <div class='mb-3'>
              <label for="formGroupExampleInput" class="form-label">Quantity</label>
              <input
                type="number"
                // value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="form-control"
                placeholder="0"
              />
            </div>
            <div class='mb-3'>
              <label for="formGroupExampleInput" class="form-label">Color</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="form-control"
                placeholder="Ex. Black"
                readOnly
              />
            </div>
            {/* <div class='mb-3'>
              <label htmlFor="branch" className="form-label">Branch</label>
              {branch.length > 0 ? (
                <select
                  id="branch"
                  className="form-select"
                  value={selectedBranch ? selectedBranch.id : ''}
                  onChange={(e) => {
                    const branchId = e.target.value;
                    const branchObj = branch.find((branchItem) => branchItem.id === branchId);
                    setSelectedBranch(branchObj);
                  }}
                >
                  <option value="">Select Branch</option>
                  {branch.map((branchItem) => (
                    <option key={branchItem.id} value={branchItem.id}>
                      {branchItem.branchName}
                    </option>
                  ))}
                </select>
              ) : (
                <p>Loading branches...</p>
              )}
            </div> */}
            <div class='mb-3'>
              <label for="formGroupExampleInput" class="form-label">Branch</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="form-control"
                placeholder=""
                readOnly
              />
            </div>
          </div>
          <div className='col-md-3'>
            <div class='mb-3'>
              <label for="formGroupExampleInput" class="form-label">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="form-control"
                placeholder="Nike"
                readOnly
              />
            </div>
            <div className="mb-3">
              <label htmlFor="formGroupExampleInput" className="form-label">Price</label>
              <div className="input-group mb-1">
                <input
                  type="text"
                  value={price}
                  onChange={handlePriceChange}
                  className="form-control"
                  placeholder="0"
                  aria-label="Amount (to the nearest currency)"
                  readOnly
                />
              </div>
            </div>
            <div class='mb-3'>
              <label for="formGroupExampleInput" class="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
                readOnly
              >
                <option value="Basketball Shoes">Basketball Shoes</option>
              </select>
            </div>
            <div class='mb-3'>
              <label for="formGroupExampleInput" class="form-label">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="form-control"
                readOnly
              >
                <option value="High Top Sneakers">High Top Sneakers</option>
                <option value="Mid-Top Sneakers">Mid-Top Sneakers</option>
                <option value="Low Top Sneakers">Low Top Sneakers</option>
                <option value="Performance Sneakers">Performance Sneakers</option>
              </select>
            </div>



          </div>
          <div className='col px-md-5 mt-3'>
            <div class='mb-3'>
              <label for="exampleFormControlTextarea1" class="form-label">Details</label>
              <textarea
                type="text"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                class="form-control"
                placeholder="Product details"
                id="exampleFormControlTextarea1"
                rows="3"
                readOnly
              >
              </textarea>
            </div>

          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={updateProduct}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Stock Out'}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default StockOut