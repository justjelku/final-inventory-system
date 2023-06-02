import EditProduct from './EditProduct'
import AddProduct from './AddProduct'
import React, { useState, useEffect } from 'react'
import { db } from '../../../../firebase'
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'

const Product = () => {
	const [products, setProducts] = useState([])
	const collectionRef = collection(db, 'todos', 'f3adC8WShePwSBwjQ2yj', 'basic_users', 'm831SaFD4oCioO6nfTc7', 'products');

	useEffect(() => {
		const getProduct = async () => {
			await getDocs(collectionRef).then((product) => {
				let productData = product.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
				setProducts(productData)
			}).catch((err) => {
				console.log(err);
			})
		}
		getProduct()
	}, [])

	// Delete todo
	const deleteProduct = async (id) => {
		window.confirm("Are you sure you want to delete this Todo?")
		await deleteDoc(doc(db, 'todos', 'f3adC8WShePwSBwjQ2yj', 'basic_users', 'm831SaFD4oCioO6nfTc7', 'products', id));
		window.location.reload();
	};

	return (
		<>
			<div className="container mt-10 d-flex align-items-start">
				<div className="row m-100 m-auto">
					<div className="col-md-12 m-auto d-flex">
						<div className="card card-white d-flex">
							<div className="card-body">
								<button
									data-bs-toggle="modal"
									data-bs-target="#addModal"
									type="button"
									className="btn btn-info m-3">Add Product
								</button>
								{products.map(({
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
									id }) =>
									<div className="todo-list" >
										<hr />
										<div className="todo-item d-flex align-items-center">
											<div className="d-flex m-3">
												<img src={productImage} alt={productTitle} className="me-3" style={{ width: '100px', height: '100px' }} />
												<div className='m-3'>
													<h5>{productTitle}</h5>
													<p>
													{productQuantity} Pairs
													</p>
													<p>{color}</p>
												</div>
											</div>
											<span className="ms-auto">
												<EditProduct
													product={{
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
												<button type="button" className="btn btn-outline-danger ms-3 m-3" onClick={() => deleteProduct(id)}
												>Delete</button>
											</span>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			<AddProduct />
		</>
	)
}
export default Product