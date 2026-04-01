import React, { useState, useEffect } from 'react';
import DomainCard from '../components/DomainCard';

const API_BASE = 'http://localhost:8081/api';

/* Fallback domain data in case backend is not running */
const FALLBACK_DOMAINS = [
  {
    name: 'Transportation',
    icon: '🚕',
    color: '#6366f1',
    description: 'Compare ride fares across Uber, Ola & Rapido — find the cheapest ride instantly',
    providerCount: 3,
    providers: ['Uber', 'Ola', 'Rapido'],
  },
  {
    name: 'Food Delivery',
    icon: '🍕',
    color: '#f97316',
    description: 'Compare food prices, delivery fees & offers from Swiggy and Zomato',
    providerCount: 2,
    providers: ['Swiggy', 'Zomato'],
  },
  {
    name: 'Grocery',
    icon: '🛒',
    color: '#10b981',
    description: 'Compare grocery prices & delivery times across BigBasket, Blinkit & Zepto',
    providerCount: 3,
    providers: ['BigBasket', 'Blinkit', 'Zepto'],
  },
  {
    name: 'Travel',
    icon: '✈️',
    color: '#3b82f6',
    description: 'Compare flight tickets, travel duration & hotel costs from MakeMyTrip & Goibibo',
    providerCount: 2,
    providers: ['MakeMyTrip', 'Goibibo'],
  },
];

function LandingPage() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const resp = await fetch(`${API_BASE}/domains`);
      if (resp.ok) {
        const data = await resp.json();
        setDomains(data);
      } else {
        setDomains(FALLBACK_DOMAINS);
      }
    } catch {
      setDomains(FALLBACK_DOMAINS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            Live price comparisons across 4 domains
          </div>
          <h1>
            Compare. Save.
            <br />
            <span className="gradient-text">Choose Smarter.</span>
          </h1>
          <p>
            India's smartest comparison platform — compare prices across rides,
            food delivery, grocery, and travel in seconds. Stop switching apps!
          </p>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="stat-value">4</div>
              <div className="stat-label">Domains</div>
            </div>
            <div className="hero-stat">
              <div className="stat-value">10+</div>
              <div className="stat-label">Providers</div>
            </div>
            <div className="hero-stat">
              <div className="stat-value">100%</div>
              <div className="stat-label">Free to Use</div>
            </div>
          </div>
        </div>
      </section>

      {/* Domain Cards */}
      <section className="domains-section" id="domains-section">
        <div className="container">
          <div className="section-header">
            <h2>Choose a Category</h2>
            <p>Select a domain to start comparing prices across providers</p>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <span className="loading-text">Loading domains...</span>
            </div>
          ) : (
            <div className="domains-grid">
              {domains.map((domain) => (
                <DomainCard key={domain.name} domain={domain} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Four simple steps to find the best deals</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Pick a Domain</h3>
              <p>
                Choose from transportation, food delivery, grocery, or travel
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Enter Details</h3>
              <p>
                Fill in your search — pickup & drop, food item, product name,
                or travel destination
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Compare & Save</h3>
              <p>
                See side-by-side prices from multiple providers and pick the
                best deal
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Visit Provider</h3>
              <p>
                Click through to book or buy directly from the provider's
                website or app
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
