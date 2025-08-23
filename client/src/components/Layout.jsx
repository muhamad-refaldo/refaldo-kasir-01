import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="drawer lg:drawer-open" data-theme="night">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-start">
        {/* Navbar */}
        <Navbar />
        {/* Page content here */}
        <main className="w-full p-4 md:p-6 bg-base-200">
          {children}
        </main>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        {/* Sidebar content here */}
        <Sidebar />
      </div>
    </div>
  );
};

export default Layout;