package com.example.mileStone1.service;

import com.example.mileStone1.model.Budget;
import com.example.mileStone1.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository repository;

    public Budget addOrUpdateBudget(String username, Budget budget) {
        // If a budget already exists for this user+category, update it
        Optional<Budget> existing = repository.findByUsernameAndCategory(
                username, budget.getCategory());

        if (existing.isPresent()) {
            Budget b = existing.get();
            b.setLimitAmount(budget.getLimitAmount());
            return repository.save(b);
        }

        budget.setUsername(username);
        return repository.save(budget);
    }

    public List<Budget> getBudgetsByUsername(String username) {
        return repository.findByUsername(username);
    }

    public void deleteBudget(Long id, String username) {
        Budget b = repository.findById(id).orElseThrow();
        if (!b.getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }
        repository.deleteById(id);
    }
}
