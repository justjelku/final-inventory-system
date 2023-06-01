import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { storage } from '../../../../firebase';
import React, { useContext, useEffect, useState } from 'react';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

const AddProduct = () => {
	const collectionRef = collection(
		db,
		'todos',
		'f3adC8WShePwSBwjQ2yj',
		'basic_users',
		'm831SaFD4oCioO6nfTc7',
		'products'
	);
	const [productTitle, setProductTitle] = useState('');
	const [size, setSize] = useState('');
	const [quantity, setQuantity] = useState('');
	const [color, setColor] = useState('');
	const [branch, setBranch] = useState('');
	const [category, setCategory] = useState('');
	const [brand, setBrand] = useState('');
	const [sizeSystem, setSizeSystem] = useState('');
	const [details, setDetails] = useState('');
	const [price, setPrice] = useState('');
	const [image, setImage] = useState(null);
	const [progresspercent, setProgresspercent] = useState(0);
	const [loading, setLoading] = useState(false);
	const [currency, setCurrency] = useState('₱');

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

	const combinedValue = `${currency} ${price}`;

	const submitTodo = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);

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
					await addDoc(collectionRef, {
						productTitle: productTitle,
						productPrice: combinedValue,
						color: color,
						category: category,
						productBrand: brand,
						type: '',
						branch: branch,
						productSize: parseInt(size),
						sizeSystem: sizeSystem,
						productImage: downloadURL,
						productQuantity: parseInt(quantity),
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
					setSizeSystem('');
					setQuantity('');
					setDetails('');
					window.location.reload();
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
					onSubmit={submitTodo}
				>
					<div className="modal-header">
						<h5 className="modal-title" id="addModalLabel">
							Add Product
						</h5>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close">
						</button>
					</div>
					<div className="modal-body">
						{/* <div className="row"> */}
						{/* <div className="col">
                {image && (
                  <div className="mb-3">
                    <label className="form-label">Current Image:</label>
                    <img src={URL.createObjectURL(image)} alt="Current Product" className="img-fluid" />
                  </div>
                )}
              </div> */}
						{/* </div> */}
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
									<label for="formGroupExampleInput" class="form-label">Branch</label>
									<input
										type="text"
										value={branch}
										onChange={(e) => setBranch(e.target.value)}
										className="form-control"
										placeholder="Ex. CDO Branch"
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
											<option value="$">$</option>
											<option value="€">€</option>
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
								</div>

							</div>
						</div>
					</div>
					<div className="modal-footer">
						<button className="btn btn-secondary" data-bs-dismiss="modal">
							Close
						</button>
						{!loading && <button className="btn btn-primary">Create Product</button>}
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddProduct;
