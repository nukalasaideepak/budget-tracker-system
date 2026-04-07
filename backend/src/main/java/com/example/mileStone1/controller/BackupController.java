package com.example.mileStone1.controller;

import com.example.mileStone1.service.BackupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/backup")
@CrossOrigin(origins = "http://localhost:4200")
public class BackupController {

    @Autowired
    private BackupService backupService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadToCloud(Authentication authentication) {
        String username = authentication.getName();
        boolean success = backupService.performCloudSync(username);
        
        if (success) {
            return ResponseEntity.ok(Map.of(
                "message", "Cloud synchronization successful",
                "timestamp", java.time.LocalDateTime.now().toString(),
                "status", "SYNCED"
            ));
        } else {
            return ResponseEntity.status(500).body(Map.of("error", "Cloud synchronization failed"));
        }
    }
}
