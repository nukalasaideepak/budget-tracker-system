package com.example.mileStone1.service;

import com.example.mileStone1.model.Transaction;
import com.example.mileStone1.repository.TransactionRepository;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;

@Service
public class ExportService {

    @Autowired
    private TransactionRepository transactionRepository;

    public byte[] generateCSV(String username) {
        List<Transaction> transactions = transactionRepository.findByUsername(username);
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Amount,Category,Type,Description,Date\n");
        for (Transaction t : transactions) {
            sb.append(t.getId()).append(",");
            sb.append(t.getAmount()).append(",");
            sb.append(escapeCsv(t.getCategory())).append(",");
            sb.append(t.getType()).append(",");
            sb.append(escapeCsv(t.getDescription() != null ? t.getDescription() : "")).append(",");
            sb.append(t.getDate() != null ? t.getDate().toString() : "").append("\n");
        }
        return sb.toString().getBytes();
    }

    public byte[] generatePDF(String username) {
        List<Transaction> transactions = transactionRepository.findByUsername(username);
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Title
            document.add(new Paragraph("BudgetWise — Financial Report")
                    .setFontSize(22)
                    .setBold()
                    .setFontColor(new DeviceRgb(0, 204, 106))
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(5));

            document.add(new Paragraph("Generated on " + LocalDate.now().toString())
                    .setFontSize(10)
                    .setFontColor(ColorConstants.GRAY)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20));

            // Summary
            double totalIncome = 0, totalExpense = 0;
            for (Transaction t : transactions) {
                if ("INCOME".equals(t.getType())) totalIncome += t.getAmount();
                else totalExpense += t.getAmount();
            }

            Table summaryTable = new Table(UnitValue.createPercentArray(3)).useAllAvailableWidth();
            summaryTable.addHeaderCell(createHeaderCell("Total Income"));
            summaryTable.addHeaderCell(createHeaderCell("Total Expenses"));
            summaryTable.addHeaderCell(createHeaderCell("Balance"));
            summaryTable.addCell(createCell("₹" + String.format("%.2f", totalIncome), new DeviceRgb(0, 200, 100)));
            summaryTable.addCell(createCell("₹" + String.format("%.2f", totalExpense), new DeviceRgb(255, 107, 107)));
            summaryTable.addCell(createCell("₹" + String.format("%.2f", totalIncome - totalExpense), new DeviceRgb(124, 140, 248)));
            document.add(summaryTable);
            document.add(new Paragraph(" ").setMarginBottom(10));

            // Transaction Table
            document.add(new Paragraph("Transaction Details")
                    .setFontSize(14)
                    .setBold()
                    .setMarginBottom(10));

            Table table = new Table(UnitValue.createPercentArray(new float[]{1, 2, 2, 2, 3, 2})).useAllAvailableWidth();
            table.addHeaderCell(createHeaderCell("#"));
            table.addHeaderCell(createHeaderCell("Amount"));
            table.addHeaderCell(createHeaderCell("Category"));
            table.addHeaderCell(createHeaderCell("Type"));
            table.addHeaderCell(createHeaderCell("Description"));
            table.addHeaderCell(createHeaderCell("Date"));

            int index = 1;
            for (Transaction t : transactions) {
                table.addCell(createCell(String.valueOf(index++), ColorConstants.BLACK));
                table.addCell(createCell("₹" + String.format("%.2f", t.getAmount()), ColorConstants.BLACK));
                table.addCell(createCell(t.getCategory() != null ? t.getCategory() : "", ColorConstants.BLACK));
                table.addCell(createCell(t.getType() != null ? t.getType() : "", ColorConstants.BLACK));
                table.addCell(createCell(t.getDescription() != null ? t.getDescription() : "", ColorConstants.BLACK));
                table.addCell(createCell(t.getDate() != null ? t.getDate().toString() : "", ColorConstants.BLACK));
            }

            document.add(table);
            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    private Cell createHeaderCell(String text) {
        return new Cell()
                .add(new Paragraph(text).setBold().setFontSize(10).setFontColor(ColorConstants.WHITE))
                .setBackgroundColor(new DeviceRgb(26, 26, 38))
                .setPadding(8);
    }

    private Cell createCell(String text, com.itextpdf.kernel.colors.Color color) {
        return new Cell()
                .add(new Paragraph(text).setFontSize(10).setFontColor(color))
                .setPadding(6);
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
