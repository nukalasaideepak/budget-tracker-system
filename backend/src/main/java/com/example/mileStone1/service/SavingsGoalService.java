package com.example.mileStone1.service;

import com.example.mileStone1.model.SavingsGoal;
import com.example.mileStone1.repository.SavingsGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SavingsGoalService {

    @Autowired
    private SavingsGoalRepository repository;

    public List<SavingsGoal> getGoalsByUsername(String username) {
        return repository.findByUsername(username);
    }

    public SavingsGoal addGoal(SavingsGoal goal) {
        if (goal.getCurrentAmount() == null) goal.setCurrentAmount(0.0);
        return repository.save(goal);
    }

    public SavingsGoal updateGoal(Long id, SavingsGoal updatedGoal) {
        if (id == null) throw new IllegalArgumentException("ID cannot be null");
        return repository.findById(id).map(goal -> {
            goal.setGoalName(updatedGoal.getGoalName());
            goal.setTargetAmount(updatedGoal.getTargetAmount());
            goal.setCurrentAmount(updatedGoal.getCurrentAmount());
            goal.setCategory(updatedGoal.getCategory());
            goal.setTargetDate(updatedGoal.getTargetDate());
            goal.setMonthlyAllocationPercentage(updatedGoal.getMonthlyAllocationPercentage());
            return repository.save(goal);
        }).orElseThrow(() -> new RuntimeException("Goal not found with id " + id));
    }

    public void deleteGoal(Long id) {
        if (id == null) return;
        repository.deleteById(id);
    }

    public Optional<SavingsGoal> getGoalById(Long id) {
        if (id == null) return Optional.empty();
        return repository.findById(id);
    }
}
