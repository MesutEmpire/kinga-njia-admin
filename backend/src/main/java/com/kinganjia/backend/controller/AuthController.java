package com.kinganjia.backend.controller;

import com.kinganjia.backend.dto.AuthResponseDTO;
import com.kinganjia.backend.dto.LoginRequestDTO;
import com.kinganjia.backend.dto.RegisterRequestDTO;
import com.kinganjia.backend.dto.UserResponseDTO;
import com.kinganjia.backend.dto.response.ApiResponse;
import com.kinganjia.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> register(
            @Valid @RequestBody RegisterRequestDTO registerRequest) {

        AuthResponseDTO authResponse = authService.register(registerRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(ApiResponse.created("User registered successfully", authResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(@Valid @RequestBody LoginRequestDTO loginRequest) {

        AuthResponseDTO authResponse = authService.login(loginRequest);

        return ResponseEntity.ok(ApiResponse.ok("Login successful", authResponse));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        UserResponseDTO user = authService.getCurrentUser(email);
        return ResponseEntity.ok(ApiResponse.ok("User retrieved successfully", user));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.ok("Logout successful", null));
    }
}