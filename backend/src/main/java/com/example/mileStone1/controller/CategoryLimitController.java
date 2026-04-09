package com.example.mileStone1.controller;

import com.example.mileStone1.model.CategoryLimit;
import com.example.mileStone1.service.CategoryLimitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/limits")
@CrossOrigin(origins = "http://localhost:4200")
public class CategoryLimitController {

    @Autowired
    private CategoryLimitService service;

    @GetMapping
    public List<CategoryLimit> getLimits(Authentication authentication) {
        return service.getLimits(authentication.getName());
    }

    @PostMapping
    public CategoryLimit saveLimit(Authentication authentication, @RequestBody CategoryLimit limit) {
        return service.saveLimit(authentication.getName(), limit);
    }
}
