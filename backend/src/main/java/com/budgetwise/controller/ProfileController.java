package com.budgetwise.controller;

import com.budgetwise.model.User;
import com.budgetwise.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:4200")
public class ProfileController {

    @Autowired
    private UserService userService;

    @GetMapping
    public Map<String, Object> getProfile(Authentication authentication) {
        String username = authentication.getName();
        Optional<User> user = userService.findByUsername(username);

        if (user.isPresent()) {
            User u = user.get();
            return Map.of(
                    "username", u.getUsername(),
                    "email", u.getEmail() != null ? u.getEmail() : "",
                    "role", u.getRole() != null ? u.getRole() : "USER",
                    "income", u.getIncome(),
                    "savings", u.getSavings(),
                    "targetExpenses", u.getTargetExpenses()
            );
        }

        return Map.of("error", "User not found");
    }

    @PostMapping
    public User updateProfile(Authentication authentication, @RequestBody User profile) {
        String username = authentication.getName();
        return userService.updateProfile(username, profile);
    }

    @PostMapping("/verify-current-password")
    public ResponseEntity<?> verifyPassword(Authentication authentication, @RequestBody Map<String, String> request) {
        String username = authentication.getName();
        String currentPassword = request.get("currentPassword");
        boolean isValid = userService.verifyCurrentPassword(username, currentPassword);
        
        if (isValid) {
            return ResponseEntity.ok(Map.of("message", "Password verified"));
        }
        return ResponseEntity.status(401).body(Map.of("error", "Incorrect current password"));
    }
}

