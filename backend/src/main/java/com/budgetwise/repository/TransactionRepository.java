package com.budgetwise.repository;

import com.budgetwise.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUsername(String username);
    
    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.username = :username AND t.type = 'EXPENSE' AND t.category = :category AND t.date >= :startDate AND t.date <= :endDate")
    Double sumExpensesByCategoryBetween(@org.springframework.data.repository.query.Param("username") String username, @org.springframework.data.repository.query.Param("category") String category, @org.springframework.data.repository.query.Param("startDate") java.time.LocalDate startDate, @org.springframework.data.repository.query.Param("endDate") java.time.LocalDate endDate);
}

