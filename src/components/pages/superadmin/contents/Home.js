import React from 'react';
import Dashboard from '../shop/Dashboard';

const HomeTabContent = () => {
  return (
    <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
	  <Dashboard />
    </div>
  );
};

export default HomeTabContent;
