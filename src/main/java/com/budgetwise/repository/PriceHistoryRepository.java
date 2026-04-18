package com.budgetwise.repository;

import com.budgetwise.model.PriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {
    List<PriceHistory> findByDomainNameAndQueryOrderByTimestampAsc(String domainName, String query);
}

