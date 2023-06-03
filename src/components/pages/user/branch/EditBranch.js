import React, { useState } from 'react';
import { collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Modal } from 'react-bootstrap';
import { db } from '../../../../firebase';

const EditBranch = ({ show, branchList, onClose }) => {
	const [branchName, setBranchName] = useState(branchList.branchName);
	const [branchAddress, setBranchAddress] = useState(branchList.branchAddress);
	const [progresspercent, setProgresspercent] = useState(0);
	const [loading, setLoading] = useState(false);

	const updateBranch = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);

			const collectionRef = collection(
				db,
				'todos',
				'f3adC8WShePwSBwjQ2yj',
				'basic_users',
				'm831SaFD4oCioO6nfTc7',
				'branch',
			);

			const branchId = branchList.id;
			const branchData = {
				branchName: branchName,
				branchAddress: branchAddress,
				updatedtime: serverTimestamp()
			};

			await updateDoc(doc(collectionRef, branchId), branchData);
			onClose();
			window.location.reload();
		} catch (err) {
			setLoading(false);
			console.log(err);
		}
	};

	return (
		<Modal show={show} onHide={onClose} size="lg">
			<Modal.Header closeButton>
				<Modal.Title>Edit {branchList.branchName}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="mb-3">
					<label htmlFor="branchName" className="form-label">
						Branch Name
					</label>
					<input
						type="text"
						id="branchName"
						className="form-control"
						value={branchName}
						onChange={(e) => setBranchName(e.target.value)}
						placeholder="Branch Name"
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="branchAddress" className="form-label">
						Branch Address
					</label>
					<input
						type="text"
						id="branchAddress"
						className="form-control"
						value={branchAddress}
						onChange={(e) => setBranchAddress(e.target.value)}
						placeholder="Branch Address"
					/>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<button className="btn btn-secondary" onClick={onClose}>
					Close
				</button>
				<button
					type="button"
					className="btn btn-outline-primary"
					onClick={updateBranch}
					disabled={loading}
				>
					{loading ? 'Updating...' : 'Update'}
				</button>
			</Modal.Footer>
		</Modal>
	)
}

export default EditBranch