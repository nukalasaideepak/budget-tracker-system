package com.budgetwise.controller;

import com.budgetwise.service.BackupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/backup")
@CrossOrigin(origins = "http://localhost:4200")
public class BackupController {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(BackupController.class);

    @Autowired
    private BackupService backupService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadToCloud(Authentication authentication) {
        String username = authentication.getName();
        try {
            boolean success = backupService.performCloudSync(username);
            if (success) {
                return ResponseEntity.ok(Map.of(
                    "message", "Cloud synchronization successful",
                    "timestamp", java.time.LocalDateTime.now().toString(),
                    "status", "SYNCED"
                ));
            } else {
                return ResponseEntity.status(500).body(Map.of("error", "Cloud synchronization failed for an unknown reason."));
            }
        } catch (Exception e) {
            logger.error("Error during cloud sync: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "error", e.getMessage() != null ? e.getMessage() : "Unknown error during cloud sync"
            ));
        }
    }
    @GetMapping("/diagnose")
    public ResponseEntity<Map<String, Object>> diagnoseSync(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(backupService.getSyncDiagnostics(username));
    }
}

