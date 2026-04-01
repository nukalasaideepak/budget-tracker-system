package com.comparekaro.controller;

import com.comparekaro.model.PriceResult;
import com.comparekaro.model.SearchRequest;
import com.comparekaro.service.ComparisonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
