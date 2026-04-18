package com.budgetwise.controller;

import com.budgetwise.model.Budget;
import com.budgetwise.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/budget")
@CrossOrigin(origins = "http://localhost:3000")
public class BudgetController {

    @Autowired
    private BudgetService service;

    @PostMapping("/add")
    public Budget addBudget(@RequestBody Budget budget,
                            Authentication authentication) {
        String username = authentication.getName();
        return service.addOrUpdateBudget(username, budget);
    }

    @GetMapping("/all")
    public List<Budget> getAllBudgets(Authentication authentication) {
        String username = authentication.getName();
        return service.getBudgetsByUsername(username);
    }

    @DeleteMapping("/{id}")
    public void deleteBudget(@PathVariable Long id,
                             Authentication authentication) {
        String username = authentication.getName();
        service.deleteBudget(id, username);
    }
}

