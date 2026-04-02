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
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User saved = userService.register(user);
            return ResponseEntity.ok(Map.of(
                    "message", "User registered successfully",
                    "username", saved.getUsername()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> dbUser = userService.login(user.getUsername(), user.getPassword());

        if (dbUser.isPresent()) {
            String token = jwtUtil.generateToken(dbUser.get().getUsername());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", dbUser.get().getUsername(),
                    "role", dbUser.get().getRole()
            ));
        }

        return ResponseEntity.status(401).body(
                Map.of("error", "Invalid Credentials"));
    }
}
