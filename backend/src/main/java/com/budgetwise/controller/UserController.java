package com.budgetwise.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @GetMapping("/profile")
    public Map<String, String> userProfile(Authentication authentication) {
        return Map.of(
                "message", "User Profile Accessed",
                "user", authentication.getName()
        );
    }
}

