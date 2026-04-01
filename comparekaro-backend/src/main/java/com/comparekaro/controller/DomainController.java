package com.comparekaro.controller;

import com.comparekaro.service.ComparisonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/domains")
public class DomainController {

    private final ComparisonService comparisonService;

    public DomainController(ComparisonService comparisonService) {
        this.comparisonService = comparisonService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllDomains() {
        return ResponseEntity.ok(comparisonService.getDomainDetails());
    }

    @GetMapping("/names")
    public ResponseEntity<List<String>> getDomainNames() {
        return ResponseEntity.ok(comparisonService.getAvailableDomains());
    }
}
