package com.budgetwise.service;

import com.budgetwise.model.Transaction;
import com.budgetwise.repository.TransactionRepository;
import com.budgetwise.repository.CategoryLimitRepository;
import com.budgetwise.model.CategoryLimit;
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
    private CategoryLimitService categoryLimitService;

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

        if (transaction.getExpenseLimit() != null && transaction.getExpenseLimit() > 0 && transaction.getCategory() != null) {
            CategoryLimit cl = new CategoryLimit();
            cl.setCategory(transaction.getCategory());
            cl.setLimitAmount(transaction.getExpenseLimit());
            categoryLimitService.saveLimit(username, cl);
        }

        checkAndSendCategoryLimitAlert(username, saved);
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
        if (updated.getExpenseLimit() != null && updated.getExpenseLimit() > 0 && updated.getCategory() != null) {
            CategoryLimit cl = new CategoryLimit();
            cl.setCategory(updated.getCategory());
            cl.setLimitAmount(updated.getExpenseLimit());
            categoryLimitService.saveLimit(username, cl);
        }

        Transaction saved = repository.save(transaction);
        checkAndSendCategoryLimitAlert(username, saved);
        return saved;
    }
    

    
    private void checkAndSendCategoryLimitAlert(String username, Transaction t) {
        System.out.println("Checking limit for " + t.getCategory() + " user: " + username);
        if (!"EXPENSE".equalsIgnoreCase(t.getType()) || t.getCategory() == null) return;
        
        categoryLimitRepository.findByUsernameAndCategory(username, t.getCategory()).ifPresentOrElse(limit -> {
            System.out.println("Found limit for " + t.getCategory() + ": " + limit.getLimitAmount());
            if (limit.getLimitAmount() != null && limit.getLimitAmount() > 0) {
                LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
                LocalDate endOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());
                
                Double totalThisMonth = repository.sumExpensesByCategoryBetween(username, t.getCategory(), startOfMonth, endOfMonth);
                System.out.println("Total this month calculated from DB: " + totalThisMonth);
                
                Double prevTotal = totalThisMonth - t.getAmount();
                System.out.println("PrevTotal calculated: " + prevTotal + " (Total " + totalThisMonth + " - newly added " + t.getAmount() + ")");
                
                if (totalThisMonth >= limit.getLimitAmount()) {
                    System.out.println("Limit crossed! Total: " + totalThisMonth + ". Limit is " + limit.getLimitAmount());
                    userService.findByUsername(username).ifPresent(user -> {
                        System.out.println("User found: " + user.getUsername() + ", email: " + user.getEmail());
                        if (user.getEmail() != null) {
                            try {
                                emailService.sendCategoryLimitAlert(user.getEmail(), t.getCategory(), limit.getLimitAmount());
                                System.out.println("Limit alert email sent successfully.");
                            } catch (Exception e) {
                                System.err.println("Failed to send limit alert: " + e.getMessage());
                                e.printStackTrace();
                            }
                        } else {
                            System.out.println("User does not have an email set.");
                        }
                    });
                } else {
                    System.out.println("Condition not met for limit alert. prevTotal < limit Check: " + (prevTotal < limit.getLimitAmount()) + ", total >= limit Check: " + (totalThisMonth >= limit.getLimitAmount()));
                }
            }
        }, () -> {
            System.out.println("No limit found for category: " + t.getCategory() + " for user: " + username);
        });
    }
}

