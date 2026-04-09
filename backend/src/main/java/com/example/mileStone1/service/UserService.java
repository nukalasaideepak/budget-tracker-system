package com.example.mileStone1.service;

import com.example.mileStone1.model.PasswordResetToken;
import com.example.mileStone1.model.User;
import com.example.mileStone1.model.VerificationToken;
import com.example.mileStone1.repository.PasswordResetTokenRepository;
import com.example.mileStone1.repository.UserRepository;
import com.example.mileStone1.repository.VerificationTokenRepository;
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
            String token = java.util.UUID.randomUUID().toString();
            resetTokenRepository.save(new PasswordResetToken(token, user));
            emailService.sendPasswordResetEmail(email, token);
        });
    }

    public String resetPassword(String token, String newPassword) {
        return resetTokenRepository.findByToken(token).map(resetToken -> {
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
