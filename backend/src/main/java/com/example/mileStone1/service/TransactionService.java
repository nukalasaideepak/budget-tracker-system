package com.example.mileStone1.service;

import com.example.mileStone1.model.Transaction;
import com.example.mileStone1.repository.TransactionRepository;
import com.example.mileStone1.repository.CategoryLimitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository repository;

    @Autowired
    private CategoryLimitRepository categoryLimitRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;

    @Autowired
    private SavingsGoalService savingsGoalService;

    public Transaction addTransaction(String username, Transaction transaction) {
        transaction.setUsername(username);
        if (transaction.getDate() == null) {
            transaction.setDate(LocalDate.now());
        }
        Transaction saved = repository.save(transaction);
        
        // Automatic Salary Allocation for Savings Goals
        if ("INCOME".equalsIgnoreCase(transaction.getType()) && 
            (transaction.getCategory() != null && 
            (transaction.getCategory().equalsIgnoreCase("Salary") || 
             transaction.getCategory().equalsIgnoreCase("Income")))) {
            savingsGoalService.allocateSalary(username, transaction.getAmount());
        }

        checkAndSendCategoryLimitAlert(username, saved);
        checkAndSendTransactionLimitAlert(username, saved);
        return saved;
    }

    public List<Transaction> getTransactionsByUsername(String username) {
        return repository.findByUsername(username);
    }

    public void deleteTransaction(Long id, String username) {
        Transaction t = repository.findById(id).orElseThrow();
        if (!t.getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }
        repository.deleteById(id);
    }

    public Transaction updateTransaction(Long id, String username, Transaction updated) {
        Transaction transaction = repository.findById(id).orElseThrow();
        if (!transaction.getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }

        transaction.setAmount(updated.getAmount());
        transaction.setCategory(updated.getCategory());
        transaction.setType(updated.getType());
        transaction.setDescription(updated.getDescription());
        transaction.setExpenseLimit(updated.getExpenseLimit());

        Transaction saved = repository.save(transaction);
        checkAndSendCategoryLimitAlert(username, saved);
        checkAndSendTransactionLimitAlert(username, saved);
        return saved;
    }
    
    private void checkAndSendTransactionLimitAlert(String username, Transaction t) {
        if (!"EXPENSE".equalsIgnoreCase(t.getType())) return;
        
        if (t.getExpenseLimit() != null && t.getExpenseLimit() > 0) {
            if (t.getAmount() >= t.getExpenseLimit()) {
                userService.findByUsername(username).ifPresent(user -> {
                    if (user.getEmail() != null) {
                        emailService.sendTransactionLimitAlert(user.getEmail(), t.getDescription(), t.getAmount(), t.getExpenseLimit());
                    }
                });
            }
        }
    }
    
    private void checkAndSendCategoryLimitAlert(String username, Transaction t) {
        if (!"EXPENSE".equalsIgnoreCase(t.getType()) || t.getCategory() == null) return;
        
        categoryLimitRepository.findByUsernameAndCategory(username, t.getCategory()).ifPresent(limit -> {
            if (limit.getLimitAmount() != null && limit.getLimitAmount() > 0) {
                LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
                LocalDate endOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());
                
                Double totalThisMonth = repository.sumExpensesByCategoryBetween(username, t.getCategory(), startOfMonth, endOfMonth);
                
                Double prevTotal = totalThisMonth - t.getAmount();
                
                if (prevTotal < limit.getLimitAmount() && totalThisMonth >= limit.getLimitAmount()) {
                    userService.findByUsername(username).ifPresent(user -> {
                        if (user.getEmail() != null) {
                            emailService.sendCategoryLimitAlert(user.getEmail(), t.getCategory(), limit.getLimitAmount());
                        }
                    });
                }
            }
        });
    }
}
