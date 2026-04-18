package com.budgetwise.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @GetMapping("/dashboard")
    public Map<String, String> adminDashboard(Authentication authentication) {
        return Map.of(
                "message", "Admin Dashboard Accessed",
                "user", authentication.getName()
        );
    }
}

