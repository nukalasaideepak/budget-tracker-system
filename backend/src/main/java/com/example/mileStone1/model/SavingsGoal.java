package com.example.mileStone1.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "savings_goals")
public class SavingsGoal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String goalName;
    private Double targetAmount;
    private Double currentAmount;
    private String username;
    private String category;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate targetDate;

    private Double monthlyAllocationPercentage;
}
