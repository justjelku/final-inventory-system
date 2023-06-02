import React, { useState, useEffect } from 'react'
import { db } from '../../../../firebase'
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'
import AddSupplier from './AddSupplier'

const Supplier = () => {
	const [supplier, setSupplier] = useState([])
	const collectionRef = collection(db, 'todos', 'f3adC8WShePwSBwjQ2yj', 'basic_users', 'm831SaFD4oCioO6nfTc7', 'suppliers');

	useEffect(() => {
		const getProduct = async () => {
			await getDocs(collectionRef).then((product) => {
				let productData = product.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
				setSupplier(productData)
			}).catch((err) => {
				console.log(err);
			})
		}
		getProduct()
	}, [])

	// Delete todo
	const deleteProduct = async (id) => {
		window.confirm("Are you sure you want to delete this Todo?")
		await deleteDoc(doc(db, 'todos', 'f3adC8WShePwSBwjQ2yj', 'basic_users', 'm831SaFD4oCioO6nfTc7', 'supplier', id));
		window.location.reload();
	};

  return (
	<>
	<div>
		<button
									data-bs-toggle="modal"
									data-bs-target="#supplierModal"
									type="button"
									className="btn btn-info m-3">Add Supplier
								</button>
		<div className="table-responsive">
        {/* <input
          type="search"
          className="form-control me-3"
          aria-label="Search"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by product title"
        /> */}
        <table className="table table-striped table-hover">
          <thead className='ms-auto'>
            <tr>
              {/* <th scope="col" className="text-center" style={{ width: '200px' }} onClick={() => handleSort('productTitle')}>
                Product Title{' '}
                {sortField === 'productTitle' && (
                  <i className={`bi bi-chevron-${sortDirection === 'asc' ? 'up' : 'down'}`} />
                )}
              </th> */}
			  <th scope="col" className="text-center">Supplier Name</th>
              <th scope="col" className="text-center">Contact Number</th>
              <th scope="col" className="text-center">Address</th>
              <th scope="col" className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {supplier.map((suppliers) => (
              <tr key={suppliers.id}>
                <td className="text-center justify-content-center">{suppliers.supplierName}</td>
                <td className="text-center justify-content-center">{suppliers.contactNumber}</td>
                <td className="text-center justify-content-center">{suppliers.supplierAddress}</td>
                {/* <td>
                  <div className="d-flex justify-content-center">
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-primary" id="dropdown-menu">
                        <i className="bi bi-three-dots"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleShowHistoryModal(product)}>
                          Stock History
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleStockInModal(product)}>
                          Stock In
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleStockOutModal(product)}>
                          Stock Out
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>

                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
	</div>
	<AddSupplier></AddSupplier>
	</>
  )
}

export default Supplier