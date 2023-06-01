import React from 'react';

const AnimatedImage = () => {
  return (
    <img
	
      src="https://firebasestorage.googleapis.com/v0/b/my-anonymity-app.appspot.com/o/logo.png?alt=media&token=c2df7400-c4e2-4238-a1dd-6d75f1de6c10&_gl=1*tc2wwn*_ga*MTQwMzcxNzM1My4xNjgzNzMxOTI3*_ga_CW55HF8NVT*MTY4NTQ2NDk1My4xNy4xLjE2ODU0NjQ5ODguMC4wLjA."
      alt="Logo"
	  style={{ 
		width: '100px', 
		height: '100px',
		alignItems: 'center',
		justifyContent: 'center',
		display: 'flex'
	  }}
      className="img-fluid rounded mx-auto d-block mt-3 animated-image "
    />
  );
};

export default AnimatedImage;
