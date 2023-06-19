import { db } from '../../../../firebase'
import { storage } from '../../../../firebase'
import React, { useState, useEffect } from 'react';
import {
  updateDoc,
  doc,
  collection,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

const EditProduct = ({ product, id }) => {
  const [productTitle, setProductTitle] = useState(product.productTitle);
  const [productId, setProductId] = useState(product.productId);
  const [size, setSize] = useState(product.productSize);
  const [barcodeId, setBarcodeId] = useState(product.barcodeId);
  const [barcodeUrl, setBarcodeUrl] = useState(product.barcodeUrl);
  const [qrcodeUrl, setQrcodeUrl] = useState(product.qrcodeUrl);
  const [quantity, setQuantity] = useState(product.productQuantity);
  const [color, setColor] = useState(product.color);
  const [branch, setBranch] = useState(product.branch);
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
  const [branch, setBranch] = useState([])
	const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

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
		const getSupplier = async () => {
			const suppliersRef = collection(
				db,
				'users',
				'qIglLalZbFgIOnO0r3Zu',
				'basic_users',
				userId,
				'suppliers'
			);

			try {
				const querySnapshot = await getDocs(suppliersRef);
				const supplierData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
				setSupplier(supplierData);
			} catch (err) {
				console.log(err);
			}
		};

		if (userId) {
			getSupplier();
		}
	}, [userId]);

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

  const updateProductData = async (downloadURL) => {
    try {
      const collectionRef = collection(
        db,
        'users',
        'qIglLalZbFgIOnO0r3Zu',
        'basic_users',
        userId,
        'products',
      );
      const docRef = doc(collectionRef, productId);

      const productData = {
        productId,
				barcodeId,
				barcodeUrl,
				qrcodeUrl,
        productTitle,
        productSize: parseInt(size),
        productQuantity: parseInt(quantity),
        color,
        branch: selectedBranch ? selectedBranch.branchName : '',
        category,
        productBrand: brand,
        sizeSystem,
        supplier: selectedSupplier ? selectedSupplier.supplierName : '',
        productDetails: details,
        productPrice: price,
        updatedtime: serverTimestamp(),
      };

      if (downloadURL) {
        productData.productImage = downloadURL;
      }

      await updateDoc(docRef, productData);
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
    <>
      <button
        type="button"
        className="btn btn-outline-primary"
        data-bs-toggle="modal"
        data-bs-target={`#id${id}`}>
        Edit
      </button>

      <div
        className="modal fade"
        id={`id${id}`}
        tabIndex="-1"
        aria-labelledby="editLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <form className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id="editLabel">
                Update Product Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close">
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                {/* <div className="row">
                  <div className="col">
                  {image && (
                      <div className="mb-3">
                        <label className="form-label">Current Image:</label>
                        <img src={image} alt="Current Product" className="img-fluid" />
                      </div>
                    )}
                  </div>
                </div> */}
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
                  {/* <div class='mb-3'>
									<label for="formGroupExampleInput" class="form-label">Size System</label>
									<input
										type="text"
										value={sizeSystem}
										onChange={(e) => setSizeSystem(e.target.value)}
										className="form-control"
										placeholder="Ex. UK, US, EU"
									/>
								</div>
								<div class='mb-3'>
									<label for="formGroupExampleInput" class="form-label">Men Size</label>
									<input
										type="number"
										value={size}
										onChange={(e) => setSize(e.target.value)}
										className="form-control"
										placeholder="Ex. 5.1"
									/>
								</div> */}
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
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="form-control"
                      placeholder="Ex. 100"
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
                    {/* <input
                      type="text"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="form-control detail-lg"
                      placeholder="Product details"
                    /> */}
                  </div>

                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-danger"
                data-bs-dismiss="modal">Close
              </button>
              <button
              type="button"
              className="btn btn-outline-primary"
              onClick={updateProduct}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditProduct