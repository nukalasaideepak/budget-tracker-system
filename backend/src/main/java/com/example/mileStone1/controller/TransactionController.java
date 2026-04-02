package com.example.mileStone1.controller;

import com.example.mileStone1.model.Transaction;
import com.example.mileStone1.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    @Autowired
    private TransactionService service;

    @PostMapping("/add")
    public Transaction addTransaction(@RequestBody Transaction transaction,
                                      Authentication authentication) {
        String username = authentication.getName();
        return service.addTransaction(username, transaction);
    }

    @GetMapping("/all")
    public List<Transaction> getAllTransactions(Authentication authentication) {
        String username = authentication.getName();
        return service.getTransactionsByUsername(username);
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id,
                                  Authentication authentication) {
        String username = authentication.getName();
        service.deleteTransaction(id, username);
    }

    @PutMapping("/update/{id}")
    public Transaction updateTransaction(@PathVariable Long id,
                                         @RequestBody Transaction transaction,
                                         Authentication authentication) {
        String username = authentication.getName();
        return service.updateTransaction(id, username, transaction);
    }
}
