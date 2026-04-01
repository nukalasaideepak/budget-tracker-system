import React from 'react';
import { Link } from 'react-router-dom';

function DomainCard({ domain }) {
  const domainSlug = domain.name;

  return (
    <Link
      to={`/compare/${domainSlug}`}
      className="domain-card"
      id={`domain-card-${domainSlug.replace(/\s/g, '-').toLowerCase()}`}
      style={{ '--domain-color': domain.color }}
    >
      <div className="domain-card-icon">{domain.icon}</div>
      <h3>{domain.name}</h3>
      <p>{domain.description}</p>
      <div className="provider-count">
        📦 {domain.providerCount} providers
      </div>
      <div className="arrow-icon">→</div>
    </Link>
  );
}

export default DomainCard;
