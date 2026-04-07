package com.example.mileStone1.service;

import com.example.mileStone1.model.Transaction;
import com.example.mileStone1.repository.TransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BackupService {

    private static final Logger logger = LoggerFactory.getLogger(BackupService.class);

    @Autowired
    private TransactionRepository transactionRepository;

    public boolean performCloudSync(String username) {
        logger.info("Initializing cloud synchronization for user: {}", username);
        
        try {
            // Fetch all transactions to "copy" to cloud
            List<Transaction> data = transactionRepository.findByUsername(username);
            
            // Simulating high-latency cloud upload (e.g. to S3, Drive, etc.)
            Thread.sleep(1500); 
            
            logger.info("Successfully synchronized {} transactions to BudgetWise Cloud.", data.size());
            return true;
        } catch (InterruptedException e) {
            logger.error("Cloud synchronization interrupted for user: {}", username);
            return false;
        } catch (Exception e) {
            logger.error("Failed to sync to cloud: {}", e.getMessage());
            return false;
        }
    }
}
