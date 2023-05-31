import React, { useState } from 'react';
import { Button, Popover } from 'react-bootstrap';
import { useAuth } from '../../../../context/AuthContext';

const UserProfilePopover = () => {
  const { user, logout } = useAuth();
  const [showPopover, setShowPopover] = useState(false);

  const handleLogout = () => {
    // Implement logout logic
    logout();
  };

  const popoverContent = (
    <div>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <Button variant="danger" onClick={handleLogout}>
        Sign Out
      </Button>
    </div>
  );

  return (
    <div>
      <Button
        variant="lg"
        className="btn-danger"
        onClick={() => setShowPopover(!showPopover)}
      >
        User Profile
      </Button>
      <Popover
        show={showPopover}
        target={document.getElementById('user-profile-button')}
        onHide={() => setShowPopover(false)}
        placement='bottom'
      >
        <Popover.Header as="h3" closeButton>
          User Profile
        </Popover.Header>
        <Popover.Body>{popoverContent}</Popover.Body>
      </Popover>
    </div>
  );
};

export default UserProfilePopover;
