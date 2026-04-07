package com.example.mileStone1.controller;

import com.example.mileStone1.model.Notification;
import com.example.mileStone1.model.PriceAlert;
import com.example.mileStone1.repository.NotificationRepository;
import com.example.mileStone1.repository.PriceAlertRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "http://localhost:3000")
public class AlertController {

    private final PriceAlertRepository alertRepository;
    private final NotificationRepository notificationRepository;

    public AlertController(PriceAlertRepository alertRepository, NotificationRepository notificationRepository) {
        this.alertRepository = alertRepository;
        this.notificationRepository = notificationRepository;
    }

    @PostMapping
    public ResponseEntity<PriceAlert> setAlert(@RequestBody PriceAlert alert) {
        // Assume username is passed securely or from JWT context, here we expect it in body
        PriceAlert saved = alertRepository.save(alert);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getNotifications(@RequestParam String username) {
        return ResponseEntity.ok(notificationRepository.findByUsernameOrderByCreatedAtDesc(username));
    }

    @PostMapping("/notifications/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
        return ResponseEntity.ok().build();
    }
}
