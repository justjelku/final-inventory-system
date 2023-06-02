import React from 'react';
import { FaUser } from 'react-icons/fa';

const EditProfile = ({
	user,
	photo,
	id,
	updateProfile,
	firstName,
	setFirstName,
	lastName,
	setLastName,
	username,
	setUsername,
	email,
	setEmail,
	password,
	setPassword
}) => {

	const handleUpdateProfile = async () => {
		try {
		  await updateProfile(firstName, lastName, username, email, password);
		  // Success notification or redirection
		} catch (error) {
		  // Error handling
		}
	  };

	return (
		<div className='row'>
					<div className='col-md-3'>
						<div className='card mt-1'>
							{photo && photo['profileUrl'] ? (
								<img
									src={photo['profileUrl']}
									alt='Profile'
									style={{ maxWidth: '100%', backgroundColor: 'white' }}
									className='card-img-top img-fluid rounded mx-auto d-block'
								/>
							) : (
								<FaUser size={32} />
							)}
							<div className='card-body'>
								{user && (
									<>
										<h5 className='card-title'>
											{user['first name']} {user['last name']}
										</h5>
										<p className='card-text'>{user && user.email}</p>
										<p className='card-text'>{user['role']} user</p>
									</>
								)}
							</div>
						</div>
					</div>
					<div className='col-md-3'>
						<div className='mb-3 mt-1'>
							<label htmlFor='formGroupExampleInput' className='form-label'>
								First Name
							</label>
							<input
								type='text'
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								className='form-control'
								placeholder='First Name'
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='formGroupExampleInput' className='form-label'>
								Last Name
							</label>
							<input
								type='text'
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								className='form-control'
								placeholder='Last Name'
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='formFileSm' className='form-label'>
								Select Image
							</label>
							<input
								className='form-control form-control-sm'
								id='formFileSm'
								type='file'
								accept='image/*'
								// onChange={handleImageChange}
							/>
						</div>
					</div>
					<div className='col-md-3'>
						<div className='mb-3 mt-1'>
							<label htmlFor='formGroupExampleInput' className='form-label'>
								Username
							</label>
							<input
								type='text'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className='form-control'
								placeholder='Username'
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='formGroupExampleInput' className='form-label'>
								Email Address
							</label>
							<input
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='form-control'
								placeholder='Email Address'
							/>
						</div>
					</div>
					<div className='col-md-3'>
						<div className='mb-3 mt-1'>
							<label htmlFor='formGroupExampleInput' className='form-label'>
								Role
							</label>
							<input
								type='text'
								value={user && user['role']}
								className='form-control'
								placeholder='Role'
								readOnly
							/>
						</div>
						<div className='mb-3'>
							<label htmlFor='formGroupExampleInput' className='form-label'>
								Password
							</label>
							<input
								type='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className='form-control'
								placeholder=''
							/>
						</div>
						<div className='mt-5 ms-auto mb-4'>
							<button 
							type='button' 
							className='btn btn-outline-primary ms-auto' 
							onClick={handleUpdateProfile}
							>
								Update Profile
							</button>
						</div>
					</div>
				</div>
	);
};

export default EditProfile;
