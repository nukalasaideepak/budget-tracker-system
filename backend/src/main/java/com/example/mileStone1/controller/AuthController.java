package com.example.mileStone1.controller;

import com.example.mileStone1.model.User;
import com.example.mileStone1.security.JwtUtil;
import com.example.mileStone1.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            userService.register(user);
            return ResponseEntity.ok(Map.of(
                    "message", "Registration successful! You can now login to your account."
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        String result = userService.verifyEmail(token);
        if (result.contains("successfully")) {
            return ResponseEntity.ok(Map.of("message", result));
        }
        return ResponseEntity.badRequest().body(Map.of("error", result));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        userService.createPasswordResetTokenForUser(email);
        return ResponseEntity.ok(Map.of("message", "If an account exists with this email, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        String result = userService.resetPassword(token, newPassword);
        
        if (result.contains("successful")) {
            return ResponseEntity.ok(Map.of("message", result));
        }
        return ResponseEntity.badRequest().body(Map.of("error", result));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            Optional<User> dbUser = userService.login(user.getUsername(), user.getPassword());
            if (dbUser.isPresent()) {
                String token = jwtUtil.generateToken(dbUser.get().getUsername());
                return ResponseEntity.ok(Map.of(
                        "token", token,
                        "username", dbUser.get().getUsername(),
                        "role", dbUser.get().getRole()
                ));
            }
            return ResponseEntity.status(401).body(Map.of("error", "Invalid Credentials"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }
}
