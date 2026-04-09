package com.example.mileStone1.controller;

import com.example.mileStone1.model.SavingsGoal;
import com.example.mileStone1.service.SavingsGoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings-goals")
public class SavingsGoalController {

    @Autowired
    private SavingsGoalService service;

    @GetMapping
    public List<SavingsGoal> getGoals(@RequestParam String username) {
        return service.getGoalsByUsername(username);
    }

    @PostMapping
    public SavingsGoal addGoal(@RequestBody SavingsGoal goal) {
        return service.addGoal(goal);
    }

    @PutMapping("/{id}")
    public SavingsGoal updateGoal(@PathVariable Long id, @RequestBody SavingsGoal goal) {
        return service.updateGoal(id, goal);
    }

    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable Long id) {
        service.deleteGoal(id);
    }
}
