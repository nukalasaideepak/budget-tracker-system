package com.budgetwise.repository;

import com.budgetwise.model.CategoryLimit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryLimitRepository extends JpaRepository<CategoryLimit, Long> {

    List<CategoryLimit> findByUsername(String username);
    
    Optional<CategoryLimit> findByUsernameAndCategory(String username, String category);
}

