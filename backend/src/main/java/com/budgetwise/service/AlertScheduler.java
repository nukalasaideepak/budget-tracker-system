package com.budgetwise.service;

import com.budgetwise.model.Notification;
import com.budgetwise.model.PriceAlert;
import com.budgetwise.repository.NotificationRepository;
import com.budgetwise.repository.PriceAlertRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class AlertScheduler {

    private final PriceAlertRepository alertRepository;
    private final NotificationRepository notificationRepository;

    public AlertScheduler(PriceAlertRepository alertRepository, NotificationRepository notificationRepository) {
        this.alertRepository = alertRepository;
        this.notificationRepository = notificationRepository;
    }

    // Runs every 30 seconds for demo purposes
    @Scheduled(fixedRate = 30000)
    public void checkForPriceDrops() {
        List<PriceAlert> activeAlerts = alertRepository.findByActiveTrue();
        
        for (PriceAlert alert : activeAlerts) {
            // Mock a 30% chance for a price drop for the demo
            if (ThreadLocalRandom.current().nextInt(100) < 30) {
                double newPrice = alert.getTargetPrice() - ThreadLocalRandom.current().nextInt(10, 50);
                if (newPrice > 0) {
                    // Send notification
                    Notification notification = new Notification(
                        alert.getUsername(),
                        "🚨 Price Drop Alert: " + alert.getQuery() + " has dropped below your target of ₹" + alert.getTargetPrice() + "! Current best price is ₹" + newPrice + "!"
                    );
                    notificationRepository.save(notification);
                    
                    // Deactivate alert after firing
                    alert.setActive(false);
                    alertRepository.save(alert);
                }
            }
        }
    }
}

