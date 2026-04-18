package com.budgetwise.service;

import com.budgetwise.model.Transaction;
import com.budgetwise.repository.TransactionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import java.io.ByteArrayOutputStream;

@Service
public class BackupService {

    private static final Logger logger = LoggerFactory.getLogger(BackupService.class);

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private GoogleDriveService googleDriveService;

    public boolean performCloudSync(String username) throws Exception {
        logger.info("Initializing Google Drive synchronization for user: {}", username);
        
        // 1. Fetch data
        List<Transaction> transactions = transactionRepository.findByUsername(username);
        if (transactions.isEmpty()) {
            logger.warn("No transactions found for user {}, skipping backup.", username);
            return true; // Nothing to sync, but not a failure
        }

        // 2. Serialize to PDF
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);
        
        document.add(new Paragraph("BudgetWise Transactions Backup").setBold().setFontSize(18));
        document.add(new Paragraph("User: " + username + "\n\n"));
        
        float[] columnWidths = {50F, 100F, 80F, 100F, 80F, 80F, 100F};
        Table table = new Table(columnWidths);
        
        // Headers
        String[] headers = {"ID", "Date", "Type", "Category", "Account", "Amount", "Description"};
        for (String header : headers) {
            table.addHeaderCell(new Cell().add(new Paragraph(header).setBold()));
        }
        
        for (Transaction t : transactions) {
            table.addCell(new Cell().add(new Paragraph(String.valueOf(t.getId()))));
            table.addCell(new Cell().add(new Paragraph(t.getDate() != null ? t.getDate().toString() : "")));
            table.addCell(new Cell().add(new Paragraph(t.getType() != null ? t.getType() : "")));
            table.addCell(new Cell().add(new Paragraph(t.getCategory() != null ? t.getCategory() : "")));
            table.addCell(new Cell().add(new Paragraph(t.getAccount() != null ? t.getAccount() : "")));
            table.addCell(new Cell().add(new Paragraph(t.getAmount() != null ? String.valueOf(t.getAmount()) : "0.0")));
            table.addCell(new Cell().add(new Paragraph(t.getDescription() != null ? t.getDescription() : "")));
        }
        
        document.add(table);
        document.close();
        
        byte[] pdfData = baos.toByteArray();

        // 3. Prepare filename
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));
        String fileName = String.format("BudgetWise_Backup_%s_%s.pdf", username, timestamp);

        // 4. Upload to Google Drive
        String fileId = googleDriveService.uploadFile(fileName, "application/pdf", pdfData);
        
        if (fileId != null) {
            logger.info("Successfully backed up {} transactions for user {} to Google Drive. File ID: {}", 
                    transactions.size(), username, fileId);
            return true;
        } else {
            logger.error("Failed to upload data to Google Drive for user: {}", username);
            return false;
        }
    }
    public java.util.Map<String, Object> getSyncDiagnostics(String username) {
        java.util.Map<String, Object> report = new java.util.HashMap<>();
        
        // 1. Check Data
        List<Transaction> transactions = transactionRepository.findByUsername(username);
        report.put("transactionsFound", transactions.size());

        // 2. Check Connection
        try {
            googleDriveService.checkFolderAccess();
            report.put("connectionStatus", "OK");
        } catch (java.io.FileNotFoundException e) {
            report.put("connectionStatus", "MISSING_CREDENTIALS");
            report.put("error", "The 'service-account.json' file is missing from src/main/resources/");
        } catch (IllegalArgumentException e) {
            report.put("connectionStatus", "INVALID_CONFIG");
            report.put("error", "The Folder ID in 'application.properties' is still set to placeholder.");
        } catch (com.google.api.client.googleapis.json.GoogleJsonResponseException e) {
            if (e.getStatusCode() == 404) {
                report.put("connectionStatus", "FOLDER_NOT_FOUND");
                report.put("error", "The Folder ID is invalid or the folder was deleted.");
            } else if (e.getStatusCode() == 403) {
                report.put("connectionStatus", "PERMISSION_DENIED");
                report.put("error", "Permission denied. You must share your Drive folder with the Service Account email.");
            } else {
                report.put("connectionStatus", "API_ERROR");
                report.put("error", e.getDetails().getMessage());
            }
        } catch (Exception e) {
            report.put("connectionStatus", "UNKNOWN_ERROR");
            report.put("error", e.getMessage());
        }
        
        return report;
    }
}

