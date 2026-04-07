package com.example.mileStone1.controller;

import com.example.mileStone1.service.ComparisonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/domains")
@CrossOrigin(origins = "http://localhost:3000")
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
