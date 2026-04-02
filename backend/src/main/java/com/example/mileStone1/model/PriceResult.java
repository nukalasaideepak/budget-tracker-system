package com.example.mileStone1.model;

import java.time.LocalDateTime;
import java.util.Map;

public class PriceResult {

    private String providerName;
    private String domainName;
    private double price;
    private String currency;
    private String eta;
    private double rating;
    private String logoUrl;
    private String baseUrl;
    private String tagline;
    private boolean bestDeal;
    private Map<String, String> metadata;
    private LocalDateTime timestamp;

    public PriceResult() {
        this.timestamp = LocalDateTime.now();
        this.currency = "INR";
    }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }
    public String getDomainName() { return domainName; }
    public void setDomainName(String domainName) { this.domainName = domainName; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getEta() { return eta; }
    public void setEta(String eta) { this.eta = eta; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }
    public boolean isBestDeal() { return bestDeal; }
    public void setBestDeal(boolean bestDeal) { this.bestDeal = bestDeal; }
    public Map<String, String> getMetadata() { return metadata; }
    public void setMetadata(Map<String, String> metadata) { this.metadata = metadata; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
