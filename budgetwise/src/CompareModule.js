import React, { useState, useEffect } from "react";
import ComparisonCard from "./ComparisonCard";
import MapSelector from "./MapSelector";

const API_BASE = "http://localhost:8080/api";

const compareStyles = `
  .compare-container {
    animation: fadeIn 0.4s ease both;
  }
  .compare-header {
    text-align: center;
    margin-bottom: 32px;
  }
  .compare-header h2 {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 700;
  }
  .compare-header p {
    color: #a0a0c0;
    margin-top: 8px;
  }
  .domains-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }
  .domain-card {
    background: #13131a;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .domain-card:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-4px);
  }
  .domain-card-icon {
    font-size: 40px;
    margin-bottom: 16px;
  }
  .domain-card h3 {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 600;
  }
  .domain-card p {
    color: #666680;
    font-size: 14px;
    margin-top: 8px;
    margin-bottom: 16px;
  }
  .provider-count {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 999px;
    font-size: 12px;
    color: #666680;
  }

  /* Domain Form / Results View */
  .back-btn {
    background: none;
    border: none;
    color: #a0a0c0;
    cursor: pointer;
    font-weight: 500;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .back-btn:hover { color: #fff; }
  
  .domain-page-header {
    text-align: center;
    margin-bottom: 32px;
  }
  .domain-icon-large { font-size: 48px; margin-bottom: 16px; display: inline-block; }
  
  .search-form {
    background: #13131a;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 32px;
  }
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  .form-row.single { grid-template-columns: 1fr; }
  .form-group label {
    font-size: 13px;
    color: #a0a0c0;
    margin-bottom: 8px;
    display: block;
  }
  .form-group input {
    width: 100%;
    padding: 12px 14px;
    background: #1a1a26;
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 10px;
    color: #fff;
    outline: none;
  }
  .form-group input:focus { border-color: #6366f1; }
  .search-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none;
    border-radius: 10px;
    color: #fff;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .search-btn:hover { transform: translateY(-2px); }
  .search-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  .sort-controls { display: flex; gap: 8px; }
  .sort-btn {
    padding: 6px 12px;
    background: #1a1a26;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 20px;
    color: #a0a0c0;
    font-size: 12px;
    cursor: pointer;
  }
  .sort-btn.active {
    background: #6366f1;
    color: #fff;
    border-color: #6366f1;
  }

  .results-grid { display: flex; flex-direction: column; gap: 16px; }

  .comparison-card {
    background: #13131a;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 24px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 24px;
    align-items: center;
    position: relative;
    overflow: hidden;
  }
  .comparison-card.best-deal {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.05);
  }
  .best-deal-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    padding: 4px 10px;
    background: #10b981;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    border-radius: 20px;
  }
  .provider-logo {
    width: 64px;
    height: 64px;
    background: #1a1a26;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .provider-logo img { width: 100%; height: 100%; object-fit: contain; }
  .provider-info h3 { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 600; margin-bottom: 2px; }
  .provider-info .tagline { color: #666680; font-size: 13px; margin-bottom: 12px; }
  .provider-meta { display: flex; gap: 16px; font-size: 13px; color: #a0a0c0; flex-wrap: wrap; }
  .meta-item { display: flex; align-items: center; gap: 4px; }
  
  .price-section { text-align: right; }
  .price-value { font-size: 28px; font-weight: 700; font-family: 'Syne', sans-serif; color: #fff; margin-bottom: 4px; }
  .price-eta { color: #10b981; font-weight: 600; font-size: 14px; margin-bottom: 12px; }
  .visit-btn {
    display: inline-block;
    padding: 8px 16px;
    background: #fff;
    color: #000;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13px;
    text-decoration: none;
  }
`;

const DOMAIN_CONFIG = {
  Transportation: {
    icon: '🚕',
    color: '#6366f1',
    subtitle: 'Compare ride fares across Uber, Ola & Rapido',
    fields: [
      { name: 'from', label: 'Pickup Location', placeholder: 'e.g. Koramangala, Bangalore', type: 'text' },
      { name: 'to', label: 'Drop Location', placeholder: 'e.g. Whitefield, Bangalore', type: 'text' },
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
      { name: 'query', label: 'Product Name', placeholder: 'e.g. Amul Milk, Aashirvaad Atta', type: 'text' },
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

const FALLBACK_DOMAINS = [
  { name: 'Transportation', icon: '🚕', count: 3, provs: ['Uber', 'Ola', 'Rapido'] },
  { name: 'Food Delivery', icon: '🍕', count: 2, provs: ['Swiggy', 'Zomato'] },
  { name: 'Grocery', icon: '🛒', count: 3, provs: ['BigBasket', 'Blinkit', 'Zepto'] },
  { name: 'Travel', icon: '✈️', count: 2, provs: ['MakeMyTrip', 'Goibibo'] },
];

function CompareModule({ token, username }) {
  const [activeDomain, setActiveDomain] = useState(null);
  const [domains, setDomains] = useState([]);
  
  const [formData, setFormData] = useState({});
  const [coordinates, setCoordinates] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState('price-low');
  
  const [history, setHistory] = useState([]);
  const [alertSet, setAlertSet] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/domains`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setDomains(data.length ? data : FALLBACK_DOMAINS))
      .catch(() => setDomains(FALLBACK_DOMAINS));
  }, [token]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCompare = async (e) => {
    e.preventDefault();
    setLoading(true); setSearched(true);
    try {
      const resp = await fetch(`${API_BASE}/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ domainName: activeDomain, ...formData, ...coordinates }),
      });
      if (resp.ok) {
        setResults(await resp.json());
        const queryKey = formData.query || (formData.from + " to " + formData.to);
        fetch(`${API_BASE}/compare/history?domainName=${activeDomain}&query=${queryKey}`, { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.json())
          .then(setHistory)
          .catch(console.error);
      }
    } catch (e) { console.error("Compare error", e); }
    finally { setLoading(false); }
  };

  const handleSetAlert = async () => {
    const queryKey = formData.query || (formData.from + " to " + formData.to);
    const targetPrice = Math.min(...results.map(r => r.price));
    try {
        await fetch(`${API_BASE}/alerts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ username, domainName: activeDomain, query: queryKey, targetPrice })
        });
        setAlertSet(true);
        setTimeout(() => setAlertSet(false), 3000);
    } catch (e) {}
  };

  if (!activeDomain) {
    return (
      <div className="compare-container">
        <style>{compareStyles}</style>
        <div className="compare-header">
          <h2>Compare Prices & Save Money</h2>
          <p>Multi-domain comparisons all in your budget dashboard</p>
        </div>
        <div className="domains-grid">
          {domains.map(d => (
            <div key={d.name} className="domain-card" onClick={() => { setActiveDomain(d.name); setResults([]); setHistory([]); setSearched(false); setFormData({}); setCoordinates({}); }}>
              <div className="domain-card-icon">{d.icon || (d.name === "Transportation" ? "🚕" : d.name === "Food Delivery" ? "🍕" : "📦")}</div>
              <h3>{d.name}</h3>
              <p>{d.description || `Compare across ${d.provs?.join(', ')}`}</p>
              <div className="provider-count">{d.providerCount || d.count} Providers</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const config = DOMAIN_CONFIG[activeDomain] || DOMAIN_CONFIG['Transportation'];
  const sorted = [...results].sort((a,b) => sortBy === 'price-low' ? a.price - b.price : sortBy === 'price-high' ? b.price - a.price : b.rating - a.rating);
  const cheapest = results.length > 0 ? Math.min(...results.map(r => r.price)) : 0;
  const maxRating = results.length > 0 ? Math.max(...results.map(r => r.rating || 0)) : 0;
  
  const parseEta = (etaStr) => parseInt((etaStr||'0').match(/\d+/)?.[0] || '999');
  const fastest = results.length > 0 ? Math.min(...results.map(r => parseEta(r.eta))) : 0;

  return (
    <div className="compare-container">
      <style>{compareStyles}</style>
      <button className="back-btn" onClick={() => setActiveDomain(null)}>← Back to Categories</button>
      
      <div className="domain-page-header">
        <div className="domain-icon-large">{config.icon}</div>
        <h2>{activeDomain}</h2>
        <p style={{color: '#a0a0c0'}}>{config.subtitle}</p>
      </div>

      {activeDomain === 'Transportation' && (
        <MapSelector onCoordinatesChange={setCoordinates} />
      )}

      <form className="search-form" onSubmit={handleCompare}>
        <div className={`form-row ${config.fields.length === 1 ? 'single' : ''}`}>
          {config.fields.map(f => (
            <div className="form-group" key={f.name}>
              <label>{f.label}</label>
              <input name={f.name} type={f.type} placeholder={f.placeholder} value={formData[f.name] || ''} onChange={handleChange} required={f.name === 'query' || f.name === 'from'} />
            </div>
          ))}
        </div>
        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? '⏳ Comparing prices...' : `🔍 Compare ${activeDomain} Prices`}
        </button>
      </form>

      {searched && (
        <div style={{animation: 'fadeIn 0.3s ease'}}>
          <div className="results-header">
            <div>
              <h3>Price Comparison</h3>
              <span style={{color: '#a0a0c0', fontSize: 14}}>{results.length} found</span>
            </div>
            <div className="sort-controls">
              <button className={`sort-btn ${sortBy === 'price-low' ? 'active' : ''}`} onClick={() => setSortBy('price-low')}>Low → High</button>
              <button className={`sort-btn ${sortBy === 'price-high' ? 'active' : ''}`} onClick={() => setSortBy('price-high')}>High → Low</button>
              <button className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`} onClick={() => setSortBy('rating')}>Top Rated</button>
              <button className="sort-btn" style={{ borderColor: '#f59e0b', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 4 }} onClick={handleSetAlert}>
                🔔 {alertSet ? "Alert Saved!" : "Set Price Alert"}
              </button>
            </div>
          </div>
          
          <div className="results-grid">
            {sorted.map(r => (
              <ComparisonCard key={r.providerName} result={{ ...r, bestDeal: r.price === cheapest, topRated: r.rating === maxRating && maxRating > 0, fastestEta: parseEta(r.eta) === fastest }} />
            ))}
          </div>

          {history.length > 1 && (
            <div style={{ marginTop: 32, padding: 24, background: '#13131a', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ marginBottom: 16, color: '#fff' }}>📉 Price Trends (Last 7 Days)</h3>
              <div style={{ position: 'relative', height: 120, width: '100%', borderBottom: '1px solid rgba(255,255,255,0.1)', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                   {/* Draw history average line! */}
                   <polyline
                     points={
                        history.map((h, i) => {
                           const x = (i / (history.length - 1)) * 100;
                           const maxP = Math.max(...history.map(x=>x.price));
                           const minP = Math.min(...history.map(x=>x.price)) * 0.8; 
                           const y = 100 - ((h.price - minP) / (maxP - minP) * 100);
                           return `${x},${Math.max(0, Math.min(100, y||50))}`;
                        }).join(' ')
                     }
                     fill="none" stroke="#6366f1" strokeWidth="2"
                   />
                </svg>
              </div>
            </div>
          )}

          {results.length >= 2 && (
            <div style={{marginTop: 24, padding: 20, background: 'rgba(16,185,129,0.08)', borderRadius: 16, border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center'}}>
              <span style={{color: '#10b981', fontWeight: 600, fontSize: 16}}>
                💰 Save up to ₹{Math.round(Math.max(...results.map(x=>x.price)) - Math.min(...results.map(x=>x.price)))} by choosing {results.reduce((min, r) => r.price < min.price ? r : min, results[0]).providerName}!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default CompareModule;
