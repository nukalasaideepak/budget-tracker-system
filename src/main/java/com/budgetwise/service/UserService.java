package com.budgetwise.service;

import com.budgetwise.model.PasswordResetToken;
import com.budgetwise.model.User;
import com.budgetwise.model.VerificationToken;
import com.budgetwise.repository.PasswordResetTokenRepository;
import com.budgetwise.repository.UserRepository;
import com.budgetwise.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private PasswordResetTokenRepository resetTokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user) {
        // Check if username already exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username '" + user.getUsername() + "' is already taken! 👤");
        }

        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email '" + user.getEmail() + "' is already registered! 📧");
        }

        // Set default role if not provided
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        
        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Enable user immediately - no email verification required
        user.setEnabled(true);
        
        User savedUser = userRepository.save(user);

        // Log successful registration
        System.out.println("════════════════════════════════════════════════════════════════");
        System.out.println("✅ USER REGISTERED: " + savedUser.getUsername());
        System.out.println("📧 Email: " + savedUser.getEmail());
        System.out.println("════════════════════════════════════════════════════════════════");

        return savedUser;
    }

    public Optional<User> login(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isPresent()) {
            User dbUser = user.get();
            
            if (passwordEncoder.matches(password, dbUser.getPassword())) {
                return Optional.of(dbUser);
            }
        }

        return Optional.empty();
    }

    public boolean verifyCurrentPassword(String username, String currentPassword) {
        return userRepository.findByUsername(username)
                .map(user -> passwordEncoder.matches(currentPassword, user.getPassword()))
                .orElse(false);
    }

    public String verifyEmail(String token) {
        return tokenRepository.findByToken(token).map(verificationToken -> {
            User user = verificationToken.getUser();
            user.setEnabled(true);
            userRepository.save(user);
            tokenRepository.delete(verificationToken);
            return "Email verified successfully! You can now login.";
        }).orElse("Invalid or expired verification token.");
    }

    public void createPasswordResetTokenForUser(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            try {
                String otp = String.format("%06d", new java.util.Random().nextInt(1000000));
                
                // Safely delete any existing token for this user
                resetTokenRepository.findAll().stream()
                    .filter(t -> t.getUser().getId().equals(user.getId()))
                    .findFirst()
                    .ifPresent(existingToken -> resetTokenRepository.delete(existingToken));

                resetTokenRepository.save(new PasswordResetToken(otp, user));
                emailService.sendPasswordResetEmail(email, otp);
            } catch (Exception e) {
                System.err.println("Error during password reset: " + e.getMessage());
            }
        });
    }

    public boolean verifyPasswordResetToken(String token) {
        return resetTokenRepository.findByToken(token).map(resetToken -> {
            java.util.Calendar cal = java.util.Calendar.getInstance();
            return (resetToken.getExpiryDate().getTime() - cal.getTime().getTime()) > 0;
        }).orElse(false);
    }

    public String resetPassword(String token, String newPassword) {
        return resetTokenRepository.findByToken(token).map(resetToken -> {
            java.util.Calendar cal = java.util.Calendar.getInstance();
            if ((resetToken.getExpiryDate().getTime() - cal.getTime().getTime()) <= 0) {
                return "Reset OTP has expired. Please request a new one.";
            }

            User user = resetToken.getUser();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            resetTokenRepository.delete(resetToken);
            return "Password reset successful! You can now login.";
        }).orElse("Invalid or expired reset token.");
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User updateProfile(String username, User profile) {
        return userRepository.findByUsername(username).map(user -> {
            // Update email if provided
            if (profile.getEmail() != null && !profile.getEmail().isEmpty()) {
                user.setEmail(profile.getEmail());
            }
            
            // Update password only if a new one is provided
            if (profile.getPassword() != null && !profile.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(profile.getPassword()));
            }

            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
}

