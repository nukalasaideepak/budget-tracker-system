package com.example.mileStone1.controller;

import com.example.mileStone1.model.PriceResult;
import com.example.mileStone1.model.SearchRequest;
import com.example.mileStone1.service.ComparisonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.example.mileStone1.model.PriceHistory;

@RestController
@RequestMapping("/api/compare")
public class ComparisonController {

    private final ComparisonService comparisonService;

    public ComparisonController(ComparisonService comparisonService) {
        this.comparisonService = comparisonService;
    }

    @PostMapping
    public ResponseEntity<List<PriceResult>> compare(@RequestBody SearchRequest request) {
        if (request.getDomainName() == null || request.getDomainName().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        List<PriceResult> results = comparisonService.compare(request);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/history")
    public ResponseEntity<List<PriceHistory>> getHistory(
            @RequestParam String domainName,
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(comparisonService.getHistory(domainName, query));
    }
}
