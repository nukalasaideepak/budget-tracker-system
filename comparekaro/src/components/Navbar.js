import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⚡</span>
          CompareKaro
        </Link>
        <div className="navbar-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          <Link
            to="/compare/Transportation"
            className={location.pathname.includes('Transportation') ? 'active' : ''}
          >
            Rides
          </Link>
          <Link
            to="/compare/Food Delivery"
            className={location.pathname.includes('Food') ? 'active' : ''}
          >
            Food
          </Link>
          <Link
            to="/compare/Grocery"
            className={location.pathname.includes('Grocery') ? 'active' : ''}
          >
            Grocery
          </Link>
          <Link
            to="/compare/Travel"
            className={location.pathname.includes('Travel') ? 'active' : ''}
          >
            Travel
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
