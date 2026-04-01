import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <div className="footer-brand">⚡ CompareKaro</div>
            <p className="footer-desc">
              India's smartest price comparison platform. Compare prices across
              rides, food delivery, grocery, and travel — all in one place.
              Stop switching between multiple apps!
            </p>
          </div>

          <div className="footer-section">
            <h4>Compare</h4>
            <Link to="/compare/Transportation">🚕 Transportation</Link>
            <Link to="/compare/Food Delivery">🍕 Food Delivery</Link>
            <Link to="/compare/Grocery">🛒 Grocery</Link>
            <Link to="/compare/Travel">✈️ Travel</Link>
          </div>

          <div className="footer-section">
            <h4>Providers</h4>
            <a href="https://www.uber.com" target="_blank" rel="noopener noreferrer">Uber</a>
            <a href="https://www.olacabs.com" target="_blank" rel="noopener noreferrer">Ola</a>
            <a href="https://www.swiggy.com" target="_blank" rel="noopener noreferrer">Swiggy</a>
            <a href="https://www.zomato.com" target="_blank" rel="noopener noreferrer">Zomato</a>
            <a href="https://www.bigbasket.com" target="_blank" rel="noopener noreferrer">BigBasket</a>
          </div>

          <div className="footer-section">
            <h4>About</h4>
            <a href="#how-it-works">How it Works</a>
            <a href="#main-navbar">Privacy Policy</a>
            <a href="#main-navbar">Terms of Service</a>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 CompareKaro. Built to save you money. 💰
        </div>
      </div>
    </footer>
  );
}

export default Footer;
