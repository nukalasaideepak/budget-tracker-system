package com.budgetwise.service;

import com.budgetwise.model.SavingsGoal;
import com.budgetwise.model.Transaction;
import com.budgetwise.repository.SavingsGoalRepository;
import com.budgetwise.repository.UserRepository;
import com.budgetwise.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SavingsGoalService {

    @Autowired
    private SavingsGoalRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    public List<SavingsGoal> getGoalsByUsername(String username) {
        return repository.findByUsername(username);
    }

    public void allocateSalary(String username, double salaryAmount) {
        List<SavingsGoal> goals = repository.findByUsername(username);
        double totalAllocated = 0;

        for (SavingsGoal goal : goals) {
            Double percentage = goal.getMonthlyAllocationPercentage();
            if (percentage != null && percentage > 0) {
                double allocation = salaryAmount * (percentage / 100.0);
                double oldAmount = goal.getCurrentAmount() != null ? goal.getCurrentAmount() : 0.0;
                goal.setCurrentAmount(oldAmount + allocation);
                repository.save(goal);
                totalAllocated += allocation;
                
                // Create a transaction for the automated allocation
                createSavingsTransaction(username, allocation, "Automated Salary Allocation: " + goal.getGoalName());
            }
        }

        // Update total user savings
        if (totalAllocated > 0) {
            final double finalAllocated = totalAllocated;
            userRepository.findByUsername(username).ifPresent(user -> {
                user.setSavings(user.getSavings() + finalAllocated);
                userRepository.save(user);
            });
        }
    }

    public SavingsGoal addGoal(SavingsGoal goal) {
        if (goal.getCurrentAmount() == null) goal.setCurrentAmount(0.0);
        SavingsGoal saved = repository.save(goal);
        
        if (goal.getCurrentAmount() > 0) {
            createSavingsTransaction(goal.getUsername(), goal.getCurrentAmount(), "Initial contribution: " + goal.getGoalName());
            updateUserSavings(goal.getUsername(), goal.getCurrentAmount());
        }
        return saved;
    }

    public SavingsGoal updateGoal(Long id, SavingsGoal updatedGoal) {
        if (id == null) throw new IllegalArgumentException("ID cannot be null");
        return repository.findById(id).map(goal -> {
            double oldAmount = goal.getCurrentAmount() != null ? goal.getCurrentAmount() : 0.0;
            double newAmount = updatedGoal.getCurrentAmount() != null ? updatedGoal.getCurrentAmount() : 0.0;
            double diff = newAmount - oldAmount;

            goal.setGoalName(updatedGoal.getGoalName());
            goal.setTargetAmount(updatedGoal.getTargetAmount());
            goal.setCurrentAmount(newAmount);
            goal.setCategory(updatedGoal.getCategory());
            goal.setTargetDate(updatedGoal.getTargetDate());
            goal.setMonthlyAllocationPercentage(updatedGoal.getMonthlyAllocationPercentage());
            
            SavingsGoal saved = repository.save(goal);

            if (diff > 0) {
                createSavingsTransaction(goal.getUsername(), diff, "Manual contribution: " + goal.getGoalName());
                updateUserSavings(goal.getUsername(), diff);
            }

            return saved;
        }).orElseThrow(() -> new RuntimeException("Goal not found with id " + id));
    }

    private void createSavingsTransaction(String username, double amount, String description) {
        Transaction tx = new Transaction();
        tx.setUsername(username);
        tx.setAmount(amount);
        tx.setType("EXPENSE"); // Debit from income
        tx.setCategory("Savings");
        tx.setDescription(description);
        tx.setDate(LocalDate.now());
        transactionRepository.save(tx);
    }

    private void updateUserSavings(String username, double amount) {
        userRepository.findByUsername(username).ifPresent(user -> {
            user.setSavings(user.getSavings() + amount);
            userRepository.save(user);
        });
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

