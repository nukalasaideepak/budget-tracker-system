package com.example.mileStone1.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String token) {
        String subject = "Verify your BudgetWise Account 🛡️";
        String verificationUrl = "http://localhost:4200/verify-email?token=" + token;
        String message = "Welcome to BudgetWise! \n\nPlease click the link below to verify your account and start managing your budget: \n" + verificationUrl;

        sendEmail(to, subject, message);
    }

    public void sendPasswordResetEmail(String to, String token) {
        String subject = "Reset your BudgetWise Password 🔑";
        String resetUrl = "http://localhost:4200/reset-password?token=" + token;
        String message = "We received a request to reset your password. \n\nPlease click the link below to choose a new password: \n" + resetUrl;

        sendEmail(to, subject, message);
    }

    private void sendEmail(String to, String subject, String content) {
        // Logging for initial developer verification
        System.out.println("------------------------------------------");
        System.out.println("Email Sent to: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Content: " + content);
        System.out.println("------------------------------------------");

        try {
            if (mailSender != null) {
                SimpleMailMessage mailMessage = new SimpleMailMessage();
                mailMessage.setTo(to);
                mailMessage.setSubject(subject);
                mailMessage.setText(content);
                mailSender.send(mailMessage);
            } else {
                System.out.println("Skipping actual email send - mailSender is null.");
            }
        } catch (Exception e) {
            System.err.println("Failed to send actual email: " + e.getMessage());
            System.err.println("Note: SMTP configuration in application.properties might be missing.");
        }
    }
}
