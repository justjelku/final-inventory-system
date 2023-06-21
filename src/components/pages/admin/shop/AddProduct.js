import { collection, addDoc, serverTimestamp, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { storage } from '../../../../firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

const AddProduct = () => {
	const [productTitle, setProductTitle] = useState('');
	const [size, setSize] = useState('');
	const [quantity, setQuantity] = useState('');
	const [color, setColor] = useState('');
	const [category, setCategory] = useState('');
	const [brand, setBrand] = useState('');
	const [type, setType] = useState('');
	const [sizeSystem, setSizeSystem] = useState('');
	const [details, setDetails] = useState('');
	const [price, setPrice] = useState('');
	const [image, setImage] = useState(null);
	const [progresspercent, setProgresspercent] = useState(0);
	const [loading, setLoading] = useState(false);
	const [currency, setCurrency] = useState('₱');
	const [userId, setUserId] = useState(null);
	const [branch, setBranch] = useState('')
	const [supplier, setSupplier] = useState('')
	// const [selectedSupplier, setSelectedSupplier] = useState(null);
	// const [selectedBranch, setSelectedBranch] = useState(null);

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

	// useEffect(() => {
	// 	const getSupplier = async () => {
	// 		const suppliersRef = collection(
	// 			db,
	// 			'users',
	// 			'qIglLalZbFgIOnO0r3Zu',
	// 			'basic_users',
	// 			userId,
	// 			'suppliers'
	// 		);

	// 		try {
	// 			const querySnapshot = await getDocs(suppliersRef);
	// 			const supplierData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
	// 			setSupplier(supplierData);
	// 		} catch (err) {
	// 			console.log(err);
	// 		}
	// 	};

	// 	if (userId) {
	// 		getSupplier();
	// 	}
	// }, [userId]);


	// useEffect(() => {
	// 	const getBranch = async () => {
	// 		const branchRef = collection(
	// 			db,
	// 			'users',
	// 			'qIglLalZbFgIOnO0r3Zu',
	// 			'basic_users',
	// 			userId,
	// 			'branch'
	// 		);

	// 		try {
	// 			const querySnapshot = await getDocs(branchRef);
	// 			const branchData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
	// 			setBranch(branchData);
	// 		} catch (err) {
	// 			console.log(err);
	// 		}
	// 	};

	// 	if (userId) {
	// 		getBranch();
	// 	}
	// }, [userId]);

	const handlePriceChange = (e) => {
		setPrice(e.target.value);
	};

	const handleCurrencyChange = (e) => {
		setCurrency(e.target.value);
	};

	const handleSizeSystem = (e) => {
		setSizeSystem(e.target.value);
	};

	const handleSizeChange = (e) => {
		setSize(e.target.value);
	};

	const handleImageChange = (event) => {
		const file = event.target?.files[0];
		setImage(file);
	};

	const getLastProductId = () => {
		const random = Math.floor(Math.random() * 100000);
		const user = firebase.auth().currentUser;
		const userId = user.uid;
		const userPrefix = userId.substring(0, 3);
		return `${userPrefix}${String(random).padStart(5, '0')}`;
	};

	const combinedValue = `${currency} ${price}`;
	const combinedSize = `${sizeSystem} ${size}`;



	const submitProduct = async (e) => {
		e.preventDefault();
		try {
		  setLoading(true);
		  const combinedSize = `${sizeSystem} ${size}`;
		  const lastProductId = getLastProductId();
		  const stockinId = `2023${userId.substring(0, 6)}${lastProductId.substring(
			lastProductId.length - 8
		  )}`;
		  const barcodeData = `2023${userId.substring(0, 4)}${lastProductId.substring(
			lastProductId.length - 3
		  )}`;
		  const productId = `2023${userId.substring(0, 5)}${lastProductId.substring(
			lastProductId.length - 8
		  )}`;
	  
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
				'products',
				productId,
				'stock_history'
			  );
			  const docRef = doc(collectionRef, productId);
			  const stckRef = doc(stockRef, productId);
			  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
	  
			  await setDoc(docRef, {
				userId: userId,
				stockinId: stockinId,
				productId: productId,
				barcodeId: barcodeData,
				barcodeUrl: '',
				qrcodeUrl: '',
				productTitle: productTitle,
				productPrice: parseInt(price),
				color: color,
				category: category,
				productBrand: brand,
				type: type,
				supplier: supplier,
				branch: branch,
				productSize: combinedSize,
				sizeSystem: sizeSystem,
				productImage: downloadURL,
				productQuantity: parseInt(quantity),
				balance: parseInt(quantity),
				productDetails: details,
				createdtime: serverTimestamp(),
				updatedtime: serverTimestamp(),
			  });
	  
			  await setDoc(stckRef, {
				userId: userId,
				stockinId: stockinId,
				stock: 'Stock In',
				productId: productId,
				barcodeId: barcodeData,
				barcodeUrl: '',
				qrcodeUrl: '',
				productTitle: productTitle,
				productPrice: parseInt(price) * parseInt(quantity),
				color: color,
				category: category,
				productBrand: brand,
				type: type,
				supplier: supplier,
				branch: branch,
				productSize: combinedSize,
				sizeSystem: sizeSystem,
				productImage: downloadURL,
				productQuantity: parseInt(quantity),
				balance: parseInt(quantity),
				productDetails: details,
				createdtime: serverTimestamp(),
				updatedtime: serverTimestamp(),
			  });
	  
			  setLoading(false);
			  setProductTitle('');
			  setPrice('');
			  setColor('');
			  setBrand('');
			  setBranch('');
			  setSize('');
			  // setSizeSystem('');
			  setQuantity('');
			  setDetails('');
			  // window.location.reload();
			}
		  );
		} catch (err) {
		  setLoading(false);
		  console.log(err);
		}
	  };
	  

	return (
		<div
			className="modal fade"
			id="addModal"
			tabIndex="-1"
			aria-labelledby="addModalLabel"
			aria-hidden="true"
		>
			<div className="modal-dialog modal-dialog-centered modal-lg">
				<form
					className="modal-content"
				>
					<div className="modal-header">
						<h5 className="modal-title" id="addModalLabel">
							Add Stock
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
									{image && (
										<div className="d-flex justify-content-center">
											{/* <label className="form-label">Selected Image:</label> */}
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
									<div className="input-group mb-1">
										<select
											className="form-select"
											value={sizeSystem}
											onChange={handleSizeSystem}
										>
											<option value="EU">EU</option>
											<option value="US">US</option>
											<option value="UK">UK</option>
											{/* Add more currency options here */}
										</select>
										<input
											type="number"
											value={size}
											onChange={handleSizeChange}
											className="form-control"
											placeholder="39.5"
											aria-label="39.5"
										/>
									</div>
								</div>
								{/* <div className="mb-3">
									<label htmlFor="formGroupExampleInput" className="form-label">Size</label>
									<div className="input-group mb-3">
										<select
											className="form-select"
											value={sizeSystem}
											onChange={handleSizeSystem}
										>
											<option value="EU">EU</option>
											<option value="US">US</option>
											<option value="UK">UK</option>
										</select>
										<input
											type="number"
											value={size}
											onChange={(e) => handleSizeChange(e.target.value)}
											className="form-control"
											placeholder="39.5"
										/>
									</div>
								</div> */}
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
								<div class='mb-3'>
									<label for="formGroupExampleInput" class="form-label">Supplier</label>
									<input
										type="text"
										value={supplier}
										onChange={(e) => setSupplier(e.target.value)}
										className="form-control"
										placeholder=""
									/>
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
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="formGroupExampleInput" className="form-label">Price</label>
									<div className="input-group mb-1">
										<select
											className="form-select"
											value={currency}
											onChange={handleCurrencyChange}
										>
											<option value="₱">₱</option>
											{/* Add more currency options here */}
										</select>
										<input
											type="number"
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
									<select
										value={category}
										onChange={(e) => setCategory(e.target.value)}
										className="form-control"
									>
										<option value="">Select Category</option>
										<option value="Basketball Shoes">Basketball Shoes</option>
									</select>
								</div>
								<div class='mb-3'>
									<label for="formGroupExampleInput" class="form-label">Type</label>
									<select
										value={type}
										onChange={(e) => setType(e.target.value)}
										className="form-control"
									>
										<option value="">Select Type</option>
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
									>
									</textarea>
								</div>

							</div>
						</div>
					</div>
					<div className="modal-footer">
						<button className="btn btn-secondary" data-bs-dismiss="modal">
							Close
						</button>
						<button
							type="button"
							className="btn btn-outline-primary"
							onClick={submitProduct}
							disabled={loading}
						>
							{loading ? 'Adding...' : 'Add Product'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddProduct;
