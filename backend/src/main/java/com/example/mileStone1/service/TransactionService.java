package com.example.mileStone1.service;

import com.example.mileStone1.model.Transaction;
import com.example.mileStone1.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository repository;

    public Transaction addTransaction(String username, Transaction transaction) {
        transaction.setUsername(username);
        if (transaction.getDate() == null) {
            transaction.setDate(LocalDate.now());
        }
        return repository.save(transaction);
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

        return repository.save(transaction);
    }
}
