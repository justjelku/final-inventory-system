import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, serverTimestamp, doc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../../../../../firebase';
import { Modal } from 'react-bootstrap';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const StockOut = ({ product, show, onClose}) => {
  const suppliersRef = collection(
    db, 
    'todos', 
    'f3adC8WShePwSBwjQ2yj', 
    'basic_users', 
    'm831SaFD4oCioO6nfTc7', 
    'suppliers'
    );    
  const [productId, setProductId] = useState(product.productId);
  const [barcodeId, setBarcodeId] = useState(product.barcodeId);
  const [barcodeUrl, setBarcodeUrl] = useState(product.barcodeUrl);
  const [qrcodeUrl, setQrcodeUrl] = useState(product.qrcodeUrl);
  const [productTitle, setProductTitle] = useState(product.productTitle);
  const [size, setSize] = useState(product.productSize);
  const [quantity, setQuantity] = useState(product.productQuantity);
  const [color, setColor] = useState(product.color);
  const [branch, setBranch] = useState([])
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [category, setCategory] = useState(product.category);
  const [brand, setBrand] = useState(product.productBrand);
  const [sizeSystem, setSizeSystem] = useState(product.sizeSystem);
  const [details, setDetails] = useState(product.productDetails);
  const [price, setPrice] = useState(product.productPrice);
  const [image, setImage] = useState(product.productImage);
  const [progresspercent, setProgresspercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState('₱');
  const [supplier, setSupplier] = useState([])
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

  useEffect(() => {
    const getBranch = async () => {
      const branchRef = collection(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
        userId,
        'branch'
      );

      try {
        const querySnapshot = await getDocs(branchRef);
        const branchData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setBranch(branchData);
      } catch (err) {
        console.log(err);
      }
    };

    if (userId) {
      getBranch();
    }
  }, [userId]);

  useEffect(() => {
    const getSupplier = async () => {
      await getDocs(suppliersRef).then((supplier) => {
        let supplierData = supplier.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setSupplier(supplierData)
      }).catch((err) => {
        console.log(err);
      })
    }
    getSupplier()
  }, [])

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      if (image && typeof image !== 'string') {
        const storageRef = ref(storage, `products/productImage/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgresspercent(progress);
          },
          (error) => {
            setLoading(false);
            alert(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            updateProductData(downloadURL);
          }
        );
      } else {
        updateProductData(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getLastProductId = () => {
		const random = Math.floor(Math.random() * 100000);
		const user = firebase.auth().currentUser;
		const userId = user.uid;
		const userPrefix = userId.substring(0, 3);
		return `${userPrefix}${String(random).padStart(5, '0')}`;
	  };

  const updateProductData = async (downloadURL) => {
    try {

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

      const productRef = doc(collectionRef, productId);
      const docRef = doc(productRef, 'stock_out', stockoutId);
      const stocksRef = doc(productRef, 'stock_history', stockoutId);
      const stockhistoryRef = doc(stockRef, stockoutId);
      const stockOutData = {
        productTitle,
        productSize: parseInt(size),
        productQuantity: parseInt(quantity),
        color,
        branch: selectedBranch ? selectedBranch.branchName : '',
        category,
        stock: 'Stock Out',
        productBrand: brand,
        sizeSystem,
        productDetails: details,
        productPrice: price,
        supplier: selectedSupplier ? selectedSupplier.supplierName : '',
        createdtime: serverTimestamp(),
        updatedtime: serverTimestamp()
      };

      const productData = {
        productTitle,
        productSize: parseInt(size),
        productQuantity: parseInt(product.productQuantity) - parseInt(quantity),
        color,
        branch,
        category,
        productBrand: brand,
        sizeSystem,
        productDetails: details,
        productPrice: price,
        updatedtime: serverTimestamp()
      };

      if (downloadURL) {
        productData.productImage = downloadURL;
      }

      if (!selectedSupplier || !selectedSupplier.supplierName) {
        alert('Please select a supplier');
        return;
      }
      

      await updateDoc(productRef, productData);
      await setDoc(docRef, stockOutData);
      await setDoc(stocksRef, stockOutData);
      await setDoc(stockhistoryRef, stockOutData);
      window.location.reload();
    } catch (err) {
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
            <div className="mb-3">
              <label htmlFor="formFileSm" className="form-label">
                Select Image
              </label>
              <input
                className="form-control form-control-sm"
                id="formFileSm"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
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
              />
            </div>
            <div className="mb-3">
              <label htmlFor="formGroupExampleInput" className="form-label">Size</label>
              <div className="input-group mb-3">
                <select
                  className="form-select"
                  value={sizeSystem}
                  onChange={(e) => setSizeSystem(e.target.value)}
                >
                  <option value="EU">EU</option>
                  <option value="US">US</option>
                  <option value="UK">UK</option>
                </select>
                <input
                  type="number"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="form-control"
                  placeholder="39.5"
                />
              </div>
            </div>
            <div className="mb-3">
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
            </div>
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
              />
            </div>
            <div class='mb-3'>
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
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
                placeholder="Basketball Shoes"
                readOnly
              />
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
          onClick={e => updateProduct(e)}
        >Stock Out</button>
      </Modal.Footer>
    </Modal>
  )
}

export default StockOut