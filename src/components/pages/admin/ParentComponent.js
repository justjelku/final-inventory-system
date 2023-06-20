import React, { useState } from 'react';
import Sidebarss from './navigation/sidebars';
import HomeTabContent from './contents/Home';

const ParentComponent = () => {
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarMinimized(!sidebarMinimized);
  };

  return (
    <div>
      <Sidebarss onToggle={handleSidebarToggle} />
      <HomeTabContent sidebarMinimized={sidebarMinimized} />
    </div>
  );
};

export default ParentComponent;