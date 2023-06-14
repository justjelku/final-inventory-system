import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase';
import {
	collection,
	getDocs,
	doc,
	deleteDoc,
	onSnapshot,
	query,
} from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import EditProduct from './EditProduct';
import AddProduct from './AddProduct';

const Product = () => {
	// STATE
	const [products, setProducts] = useState([]);
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

	// Delete todo
	const deleteProduct = async (id) => {
		const confirmDelete = window.confirm(
			'Are you sure you want to delete this Product?'
		);
		if (confirmDelete) {
			try {
				await deleteDoc(
					doc(
						db,
						'users',
						'qIglLalZbFgIOnO0r3Zu',
						'basic_users',
						userId,
						'products',
						id
					)
				);
				window.location.reload();
			} catch (err) {
				console.log(err);
			}
		}
	};

	return (
		<>
		<h2 className='mt-3'>
			Manage Stocks
		</h2>
			<div className="container mt-10 d-flex align-items-start">
				<div className="row m-100 m-auto">
					<div className="col-md-12 m-auto d-flex">
						<div className="card card-white d-flex">
							<div className="card-body">
								<button
									data-bs-toggle="modal"
									data-bs-target="#addModal"
									type="button"
									className="btn btn-info m-3"
								>
									Add Product
								</button>
								{products.map(
									({
										productId,
										barcodeId,
										barcodeUrl,
										qrcodeUrl,
										productTitle,
										productSize,
										productQuantity,
										color,
										category,
										branch,
										productBrand,
										sizeSystem,
										productDetails,
										productPrice,
										productImage,
										id,
									}) => (
										<div className="todo-list" key={id}>
											<hr />
											<div className="todo-item d-flex align-items-center">
												<div className="d-flex m-3">
													<img
														src={productImage}
														alt={productTitle}
														className="me-3"
														style={{ width: '100px', height: '100px' }}
													/>
													<div className="m-3">
														<h5>{productTitle}</h5>
														<p>{productQuantity} Pairs</p>
														<p>{color}</p>
													</div>
												</div>
												<span className="ms-auto">
													<EditProduct
														product={{
															productId,
															barcodeId,
															barcodeUrl,
															qrcodeUrl,
															productTitle,
															productSize,
															productQuantity,
															color,
															category,
															branch,
															productBrand,
															sizeSystem,
															productDetails,
															productPrice,
															productImage,
														}}
														id={id}
													/>
													<button
														type="button"
														className="btn btn-outline-danger ms-3 m-3"
														onClick={() => deleteProduct(id)}
													>
														Delete
													</button>
												</span>
											</div>
										</div>
									)
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			<AddProduct />
		</>
	);
};

export default Product;
