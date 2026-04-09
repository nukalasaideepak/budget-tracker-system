package com.example.mileStone1.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "price_alerts")
@Data
public class PriceAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String query;

    @Column(nullable = false)
    private double targetPrice;

    private boolean active = true;

    public PriceAlert() {}

    public PriceAlert(String username, String query, double targetPrice) {
        this.username = username;
        this.query = query;
        this.targetPrice = targetPrice;
    }
}
