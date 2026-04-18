package com.budgetwise.controller;

import com.budgetwise.service.ExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "http://localhost:3000")
public class ExportController {

    @Autowired
    private ExportService exportService;

    @GetMapping("/csv")
    public ResponseEntity<byte[]> exportCSV(Authentication authentication) {
        String username = authentication.getName();
        byte[] csv = exportService.generateCSV(username);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=budgetwise_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> exportPDF(Authentication authentication) {
        String username = authentication.getName();
        byte[] pdf = exportService.generatePDF(username);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=budgetwise_report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}

