import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ComparisonCard from '../components/ComparisonCard';

const API_BASE = 'http://localhost:8081/api';

/* Domain configuration — icons, colors, and form fields */
const DOMAIN_CONFIG = {
  Transportation: {
    icon: '🚕',
    color: '#6366f1',
    subtitle: 'Compare ride fares across Uber, Ola & Rapido',
    fields: [
      { name: 'from', label: 'Pickup Location (Source)', placeholder: 'e.g. Koramangala, Bangalore', type: 'text' },
      { name: 'to', label: 'Drop Location (Destination)', placeholder: 'e.g. Whitefield, Bangalore', type: 'text' },
    ],
  },
  'Food Delivery': {
    icon: '🍕',
    color: '#f97316',
    subtitle: 'Find the best food deals from Swiggy & Zomato',
    fields: [
      { name: 'query', label: 'Food Item or Restaurant', placeholder: 'e.g. Chicken Biryani, Pizza Hut', type: 'text' },
      { name: 'from', label: 'Delivery Location', placeholder: 'e.g. HSR Layout, Bangalore', type: 'text' },
    ],
  },
  Grocery: {
    icon: '🛒',
    color: '#10b981',
    subtitle: 'Compare grocery prices across BigBasket, Blinkit & Zepto',
    fields: [
      { name: 'query', label: 'Product Name', placeholder: 'e.g. Amul Milk, Aashirvaad Atta, Eggs', type: 'text' },
      { name: 'from', label: 'Delivery Location', placeholder: 'e.g. Indiranagar, Bangalore', type: 'text' },
    ],
  },
  Travel: {
    icon: '✈️',
    color: '#3b82f6',
    subtitle: 'Find cheapest flights & hotels from MakeMyTrip & Goibibo',
    fields: [
      { name: 'from', label: 'From City', placeholder: 'e.g. Bangalore (BLR)', type: 'text' },
      { name: 'to', label: 'To City', placeholder: 'e.g. Delhi (DEL)', type: 'text' },
      { name: 'date', label: 'Travel Date', placeholder: '', type: 'date' },
    ],
  },
};

/* Simulated fallback data for when backend is not running */
const FALLBACK_RESULTS = {
  Transportation: [
    { providerName: 'Rapido', domainName: 'Transportation', price: 89, currency: 'INR', eta: '3 mins', rating: 4.1, logoUrl: 'https://logo.clearbit.com/rapido.bike', baseUrl: 'https://www.rapido.bike', tagline: 'Bike taxi, auto & more', bestDeal: true, metadata: { rideType: 'Rapido Bike', surge: 'None' } },
    { providerName: 'Ola', domainName: 'Transportation', price: 195, currency: 'INR', eta: '5 mins', rating: 4.3, logoUrl: 'https://logo.clearbit.com/olacabs.com', baseUrl: 'https://www.olacabs.com', tagline: 'Chalo, niklo!', bestDeal: false, metadata: { rideType: 'Ola Mini', surge: 'None' } },
    { providerName: 'Uber', domainName: 'Transportation', price: 245, currency: 'INR', eta: '7 mins', rating: 4.5, logoUrl: 'https://logo.clearbit.com/uber.com', baseUrl: 'https://www.uber.com', tagline: 'Your ride, on demand', bestDeal: false, metadata: { rideType: 'UberGo', surge: '1.2x' } },
  ],
  'Food Delivery': [
    { providerName: 'Zomato', domainName: 'Food Delivery', price: 249, currency: 'INR', eta: '30 mins', rating: 4.3, logoUrl: 'https://logo.clearbit.com/zomato.com', baseUrl: 'https://www.zomato.com', tagline: 'Better food for more people', bestDeal: true, metadata: { deliveryFee: '₹15', discount: 'Flat ₹75 OFF' } },
    { providerName: 'Swiggy', domainName: 'Food Delivery', price: 289, currency: 'INR', eta: '25 mins', rating: 4.4, logoUrl: 'https://logo.clearbit.com/swiggy.com', baseUrl: 'https://www.swiggy.com', tagline: "What's on your mind?", bestDeal: false, metadata: { deliveryFee: '₹30', discount: '20% OFF up to ₹100' } },
  ],
  Grocery: [
    { providerName: 'Zepto', domainName: 'Grocery', price: 45, currency: 'INR', eta: '10 mins', rating: 4.3, logoUrl: 'https://logo.clearbit.com/zeptonow.com', baseUrl: 'https://www.zeptonow.com', tagline: 'Grocery delivered in 10 minutes', bestDeal: true, metadata: { deliveryFee: 'FREE', deliveryTime: '10 mins' } },
    { providerName: 'Blinkit', domainName: 'Grocery', price: 49, currency: 'INR', eta: '15 mins', rating: 4.2, logoUrl: 'https://logo.clearbit.com/blinkit.com', baseUrl: 'https://www.blinkit.com', tagline: 'Everything delivered in minutes', bestDeal: false, metadata: { deliveryFee: '₹25', deliveryTime: '15 mins' } },
    { providerName: 'BigBasket', domainName: 'Grocery', price: 52, currency: 'INR', eta: '30 mins', rating: 4.4, logoUrl: 'https://logo.clearbit.com/bigbasket.com', baseUrl: 'https://www.bigbasket.com', tagline: 'India\'s largest online grocery', bestDeal: false, metadata: { deliveryFee: 'FREE above ₹200', deliveryTime: '30 mins' } },
  ],
  Travel: [
    { providerName: 'Goibibo', domainName: 'Travel', price: 3499, currency: 'INR', eta: '2h 15m', rating: 4.2, logoUrl: 'https://logo.clearbit.com/goibibo.com', baseUrl: 'https://www.goibibo.com', tagline: 'Smart way to travel', bestDeal: true, metadata: { class: 'Economy', airline: 'IndiGo' } },
    { providerName: 'MakeMyTrip', domainName: 'Travel', price: 3899, currency: 'INR', eta: '2h 30m', rating: 4.5, logoUrl: 'https://logo.clearbit.com/makemytrip.com', baseUrl: 'https://www.makemytrip.com', tagline: 'Dil Toh Roaming Hai', bestDeal: false, metadata: { class: 'Economy', airline: 'Air India' } },
  ],
};

function DomainPage() {
  const { domainName } = useParams();
  const navigate = useNavigate();
  const config = DOMAIN_CONFIG[domainName] || DOMAIN_CONFIG['Transportation'];

  const [formData, setFormData] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState('price-low');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompare = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const resp = await fetch(`${API_BASE}/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainName, ...formData }),
      });

      if (resp.ok) {
        const data = await resp.json();
        setResults(data);
      } else {
        setResults(FALLBACK_RESULTS[domainName] || []);
      }
    } catch {
      setResults(FALLBACK_RESULTS[domainName] || []);
    } finally {
      setLoading(false);
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'price-low':
      default: return a.price - b.price;
    }
  });

  // Recalculate best deal based on current sort (cheapest is always best deal)
  const cheapest = results.length > 0 ? Math.min(...results.map(r => r.price)) : 0;

  return (
    <div className="domain-page" id="domain-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Categories
        </button>

        <div className="domain-page-header">
          <div className="domain-icon-large">{config.icon}</div>
          <h1>{domainName}</h1>
          <p>{config.subtitle}</p>
        </div>

        {/* Search Form */}
        <form className="search-form" id="search-form" onSubmit={handleCompare}>
          <div className={`form-row ${config.fields.length === 1 ? 'single' : ''}`}>
            {config.fields.map((field) => (
              <div className="form-group" key={field.name}>
                <label htmlFor={field.name}>{field.label}</label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.name === 'query' || field.name === 'from'}
                />
              </div>
            ))}
          </div>

          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? '⏳ Comparing prices...' : `🔍 Compare ${domainName} Prices`}
          </button>
        </form>

        {/* Results */}
        {searched && (
          <div className="results-section" id="results-section">
            <div className="results-header">
              <div>
                <h2>Price Comparison</h2>
                <span className="results-count">
                  {results.length} provider{results.length !== 1 ? 's' : ''} found
                </span>
              </div>

              <div className="sort-controls">
                <button
                  className={`sort-btn ${sortBy === 'price-low' ? 'active' : ''}`}
                  onClick={() => setSortBy('price-low')}
                >
                  Price: Low → High
                </button>
                <button
                  className={`sort-btn ${sortBy === 'price-high' ? 'active' : ''}`}
                  onClick={() => setSortBy('price-high')}
                >
                  Price: High → Low
                </button>
                <button
                  className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`}
                  onClick={() => setSortBy('rating')}
                >
                  Top Rated
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span className="loading-text">
                  Fetching prices from providers...
                </span>
              </div>
            ) : results.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No results found</h3>
                <p>Try a different search or check back later</p>
              </div>
            ) : (
              <div className="results-grid">
                {sortedResults.map((result) => (
                  <ComparisonCard
                    key={result.providerName}
                    result={{ ...result, bestDeal: result.price === cheapest }}
                  />
                ))}
              </div>
            )}

            {/* Savings Summary */}
            {results.length >= 2 && (
              <div
                className="savings-summary"
                style={{
                  marginTop: '24px',
                  padding: '20px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '16px',
                  textAlign: 'center',
                }}
              >
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#10b981',
                }}>
                  💰 You can save up to ₹
                  {Math.round(
                    Math.max(...results.map((r) => r.price)) -
                    Math.min(...results.map((r) => r.price))
                  ).toLocaleString('en-IN')}{' '}
                  by choosing {results.reduce((min, r) => r.price < min.price ? r : min, results[0]).providerName}!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DomainPage;
