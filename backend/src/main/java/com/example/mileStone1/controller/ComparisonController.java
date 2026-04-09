package com.example.mileStone1.controller;

import com.example.mileStone1.model.PriceResult;
import com.example.mileStone1.model.SearchRequest;
import com.example.mileStone1.service.ComparisonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import com.example.mileStone1.model.PriceHistory;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping({"/api/compare", "/api/domains"})
public class ComparisonController {

    private final ComparisonService comparisonService;

    public ComparisonController(ComparisonService comparisonService) {
        this.comparisonService = comparisonService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getDomains(HttpServletRequest request) {
        System.out.println("Processing Comparison Domains request from: " + request.getRequestURI());
        return ResponseEntity.ok(comparisonService.getDomainDetails());
    }

    @GetMapping("/details")
    public ResponseEntity<List<Map<String, Object>>> getDomainDetails(HttpServletRequest request) {
        System.out.println("Processing Comparison Details request from: " + request.getRequestURI());
        return ResponseEntity.ok(comparisonService.getDomainDetails());
    }

    @PostMapping
    public ResponseEntity<List<PriceResult>> compare(@RequestBody SearchRequest request) {
        System.out.println("Processing Price Search for Domain: " + request.getDomainName());
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
