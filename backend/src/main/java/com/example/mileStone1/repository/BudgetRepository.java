package com.example.mileStone1.repository;

import com.example.mileStone1.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUsername(String username);

    Optional<Budget> findByUsernameAndCategory(String username, String category);
}
