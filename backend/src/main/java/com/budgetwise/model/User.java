package com.budgetwise.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "USERS")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;
    private String email;

    @JsonProperty
    private String password;

    private double income;
    private double savings;
    private double targetExpenses;

    private String role;
    private boolean enabled = true;

    public User() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public double getIncome() { return income; }
    public void setIncome(double income) { this.income = income; }

    public double getSavings() { return savings; }
    public void setSavings(double savings) { this.savings = savings; }

    public double getTargetExpenses() { return targetExpenses; }
    public void setTargetExpenses(double targetExpenses) { this.targetExpenses = targetExpenses; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
}

