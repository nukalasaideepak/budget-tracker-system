package com.example.mileStone1.controller;

import com.example.mileStone1.model.User;
import com.example.mileStone1.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
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
}
