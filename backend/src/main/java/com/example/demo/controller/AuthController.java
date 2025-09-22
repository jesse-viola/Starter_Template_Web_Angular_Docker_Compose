package com.example.demo.controller;

import com.example.demo.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ---------------- Login ----------------
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            String token = authService.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(new LoginResponse(token));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    // ---------------- Register ----------------
    // TODO: need registration DTO, should be different from the LoginRequest DTO,
    // RegisterRequest
    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody LoginRequest request) {
        try {
            authService.register(request.getEmail(), request.getUsername(), request.getPassword());
            // Return JWT immediately after registration
            String token = authService.login(request.getEmail(), request.getPassword());
            return ResponseEntity.status(HttpStatus.CREATED).body(new LoginResponse(token));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // ---------------- DTOs ----------------
    public static class LoginRequest {

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        private String email;

        @NotBlank(message = "Username is required")
        private String username;

        @NotBlank(message = "Password is required")
        private String password;

        // Getters & setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    /**
     * TODO: maybe something like this for the auth response?
     * public static class LoginResponse {
     * private String accessToken;
     * private String refreshToken; // For token renewal
     * private String tokenType = "Bearer";
     * private long expiresIn; // Seconds until expiration
     * private UserInfo user; // Basic user info
     * 
     * // Constructors, getters, setters
     * }
     * 
     * public static class UserInfo {
     * private String id;
     * private String email;
     * private String username;
     * private List<String> roles;
     * // No sensitive data like password
     * }
     * 
     * Why this approach is preferred:
     * 
     * 1. Frontend Token Management: Frontend needs expiresIn to know when to
     * refresh
     * 2. Refresh Tokens: Industry standard for secure token renewal without
     * re-authentication
     * 3. User Context: Frontend needs basic user info for UI personalization
     * 4. Token Type: Explicit "Bearer" for Authorization header
     * 5. Security: Separate short-lived access token + longer-lived refresh token
     * 
     * Your current approach risks:
     * - Frontend can't manage token expiration properly
     * - No token refresh mechanism
     * - User has to re-login when token expires
     * - Less secure (typically longer-lived tokens to avoid frequent re-auth)
     * 
     * Modern pattern:
     * - Access token: 15-30 minutes
     * - Refresh token: 7-30 days
     * - Frontend automatically refreshes access token using refresh token
     */
    public static class LoginResponse {
        private String token;

        public LoginResponse(String token) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }
    }
}
