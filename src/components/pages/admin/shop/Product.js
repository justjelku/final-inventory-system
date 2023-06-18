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

	// Delete product
	const deleteProduct = async (id) => {
		const confirmDelete = window.confirm('Are you sure you want to delete this product?');
		if (confirmDelete) {
			try {
				await deleteDoc(doc(db, 'users', 'qIglLalZbFgIOnO0r3Zu', 'basic_users', userId, 'products', id));
				window.location.reload();
			} catch (err) {
				console.log(err);
			}
		}
	};

	return (
		<>
			<h2 className='mt-3'>Manage Stocks</h2>
			<button
				data-bs-toggle="modal"
				data-bs-target="#addModal"
				type="button"
				className="btn btn-info m-3"
			>
				Add Product
			</button>
			<div className="container mt-10">
				<div className="row">
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
							<div className="col-md-4 mb-4" key={id}>
								<div className="card">
									<img
										src={productImage}
										alt={productTitle}
										className="card-img-top"
										style={{ width: '100%', height: '200px', objectFit: 'cover' }}
									/>
									<div className="card-body">
										<h5 className="card-title">{productTitle}</h5>
										<p className="card-text">{productQuantity} Pairs</p>
										<p className="card-text">{color}</p>
									</div>
									<div className="card-footer">
  <div className="d-flex justify-content-between">
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
    >
      <button type="button" className="btn btn-outline-primary">
        <i className="bi bi-pencil-square"></i> Edit
      </button>
    </EditProduct>
    <div className="ms-2">
      <button
        type="button"
        className="btn btn-outline-danger"
        onClick={() => deleteProduct(id)}
      >
        <i className="bi bi-trash"></i> Delete
      </button>
    </div>
  </div>
</div>

								</div>
							</div>
						)
					)}
				</div>
			</div>
			<AddProduct />
		</>
	);
};

export default Product;
