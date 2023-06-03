import React, { useState, useEffect } from 'react'
import { db } from '../../../../firebase'
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'
import AddBranch from './AddBranch'
import { Dropdown } from 'react-bootstrap';
import EditBranch from './EditBranch';

const Branch = () => {
	const [branch, setBranch] = useState([])
  const [showEditBranchModal, setShowEditBranchModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
	const collectionRef = collection(db, 'todos', 'f3adC8WShePwSBwjQ2yj', 'basic_users', 'm831SaFD4oCioO6nfTc7', 'branch');

	useEffect(() => {
		const getBranch = async () => {
			await getDocs(collectionRef).then((branch) => {
				let branchData = branch.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
				setBranch(branchData)
			}).catch((err) => {
				console.log(err);
			})
		}
		getBranch()
	}, [])

	// Delete todo
	const deleteBranch = async (id) => {
		window.confirm("Are you sure you want to delete this Branch?")
		await deleteDoc(doc(db, 'todos', 'f3adC8WShePwSBwjQ2yj', 'basic_users', 'm831SaFD4oCioO6nfTc7', 'branch', id));
		window.location.reload();
	};

  const handleEditBranchModal = (branch) => {
    setSelectedBranch(branch);
    setShowEditBranchModal(true);
  };

  const handleCloseEditBranchModal = () => {
    setShowEditBranchModal(false);
  };

  return (
	<>
	<div>
		<button
									data-bs-toggle="modal"
									data-bs-target="#branchModal"
									type="button"
									className="btn btn-info m-3">Add Branch
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
			  <th scope="col" className="text-center">Branch Name</th>
              {/* <th scope="col" className="text-center">Contact Number</th> */}
              <th scope="col" className="text-center">Address</th>
              <th scope="col" className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {branch.map((branchList) => (
              <tr key={branchList.id}>
                <td className="text-center justify-content-center">{branchList.branchName}</td>
                {/* <td className="text-center justify-content-center">{suppliers.contactNumber}</td> */}
                <td className="text-center justify-content-center">{branchList.branchAddress}</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-primary" id="dropdown-menu">
                        <i className="bi bi-three-dots"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => deleteBranch(branchList.id)}>
                          Delete Branch
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleEditBranchModal(branchList)}>
                          Edit Branch
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedBranch && (
          <EditBranch
            show={showEditBranchModal}
            onClose={handleCloseEditBranchModal}
            branchList={selectedBranch}
          />
        )}
      </div>
	</div>
	<AddBranch />
	</>
  )
}

export default Branch