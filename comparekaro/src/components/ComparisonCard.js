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
      {result.bestDeal && (
        <div className="best-deal-badge">🏆 Best Deal</div>
      )}

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
