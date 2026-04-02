package com.example.mileStone1.model;

import jakarta.persistence.*;

@Entity
@Table(name = "price_alerts")
public class PriceAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String domainName;

    @Column(nullable = false)
    private String query;

    @Column(nullable = false)
    private double targetPrice;

    private boolean active = true;

    public PriceAlert() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getDomainName() { return domainName; }
    public void setDomainName(String domainName) { this.domainName = domainName; }
    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
    public double getTargetPrice() { return targetPrice; }
    public void setTargetPrice(double targetPrice) { this.targetPrice = targetPrice; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
