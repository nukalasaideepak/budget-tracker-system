package com.example.mileStone1.model;

public class SearchRequest {

    private String domainName;
    private String query;
    private String from;
    private String to;
    private String category;
    private String date;
    private int passengers;

    private Double fromLat;
    private Double fromLng;
    private Double toLat;
    private Double toLng;

    public SearchRequest() {}

    public String getDomainName() { return domainName; }
    public void setDomainName(String domainName) { this.domainName = domainName; }
    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }
    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public int getPassengers() { return passengers; }
    public void setPassengers(int passengers) { this.passengers = passengers; }

    public Double getFromLat() { return fromLat; }
    public void setFromLat(Double fromLat) { this.fromLat = fromLat; }
    public Double getFromLng() { return fromLng; }
    public void setFromLng(Double fromLng) { this.fromLng = fromLng; }
    public Double getToLat() { return toLat; }
    public void setToLat(Double toLat) { this.toLat = toLat; }
    public Double getToLng() { return toLng; }
    public void setToLng(Double toLng) { this.toLng = toLng; }
}
