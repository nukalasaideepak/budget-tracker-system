import React from 'react';

function ComparisonCard({ result }) {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} style={{ opacity: i < fullStars ? 1 : 0.3 }}>
          ★
        </span>
      );
    }
    return stars;
  };

  const getDomainIcon = (domainName) => {
    switch (domainName) {
      case 'Transportation': return '🚕';
      case 'Food Delivery': return '🍕';
      case 'Grocery': return '🛒';
      case 'Travel': return '✈️';
      default: return '📦';
    }
  };

  return (
    <div
      className={`comparison-card ${result.bestDeal ? 'best-deal' : ''}`}
      id={`card-${result.providerName.replace(/\s/g, '-').toLowerCase()}`}
    >
      <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8 }}>
        {result.bestDeal && (
          <div className="best-deal-badge" style={{ position: 'static' }}>🏆 Best Price</div>
        )}
        {result.fastestEta && (
           <div className="best-deal-badge" style={{ position: 'static', background: '#3b82f6', borderColor: '#3b82f6' }}>⚡ Fastest</div>
        )}
        {result.topRated && (
           <div className="best-deal-badge" style={{ position: 'static', background: '#f59e0b', borderColor: '#f59e0b' }}>⭐ Top Rated</div>
        )}
      </div>

      <div className="provider-logo">
        <img
          src={result.logoUrl}
          alt={result.providerName}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = `<span style="font-size:1.5rem">${getDomainIcon(result.domainName)}</span>`;
          }}
        />
      </div>

      <div className="provider-info">
        <h3>{result.providerName}</h3>
        <p className="tagline">{result.tagline}</p>
        <div className="provider-meta">
          <span className="meta-item">
            <span className="rating">
              {renderStars(result.rating)}
              <span className="rating-value">{result.rating}</span>
            </span>
          </span>
          <span className="meta-item">⏱ {result.eta}</span>
          {result.metadata && Object.entries(result.metadata).slice(0, 2).map(([key, value]) => (
            <span className="meta-item" key={key}>
              {value}
            </span>
          ))}
          
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.1)', padding: '6px 12px', borderRadius: '8px', border: '1px dashed #6366f1' }}>
             <span style={{ fontSize: 16 }}>🎟️</span>
             <span style={{ color: '#fff', fontWeight: 700, fontFamily: 'monospace', fontSize: 14 }}>{result.providerName.toUpperCase()}{Math.max(10, Math.floor(result.price % 50))}</span>
             <span style={{ color: '#6366f1', fontSize: 12, fontWeight: 600, marginLeft: 4 }}>COUPON APPLIED</span>
          </div>
        </div>
      </div>

      <div className="price-section">
        <div className="price-value">
          <span className="price-currency">₹</span>
          {Math.round(result.price).toLocaleString('en-IN')}
        </div>
        <div className="price-eta">{result.eta}</div>
        <a
          href={result.baseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="visit-btn"
        >
          Visit {result.providerName} →
        </a>
      </div>
    </div>
  );
}

export default ComparisonCard;
