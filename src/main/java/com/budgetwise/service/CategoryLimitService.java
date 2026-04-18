package com.budgetwise.service;

import com.budgetwise.model.CategoryLimit;
import com.budgetwise.repository.CategoryLimitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryLimitService {

    @Autowired
    private CategoryLimitRepository repository;

    public List<CategoryLimit> getLimits(String username) {
        return repository.findByUsername(username);
    }

    public CategoryLimit saveLimit(String username, CategoryLimit limit) {
        if (limit.getLimitAmount() == null) {
            limit.setLimitAmount(0.0);
        }
        Optional<CategoryLimit> existing = repository.findByUsernameAndCategory(username, limit.getCategory());
        if (existing.isPresent()) {
            CategoryLimit updated = existing.get();
            updated.setLimitAmount(limit.getLimitAmount());
            return repository.save(updated);
        } else {
            limit.setUsername(username);
            return repository.save(limit);
        }
    }
}

