package com.kinganjia.backend.controller;

import com.kinganjia.backend.dto.UserRequestDTO;
import com.kinganjia.backend.dto.UserResponseDTO;
import com.kinganjia.backend.dto.response.ApiResponse;
import com.kinganjia.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@Slf4j
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponseDTO>>> getUsers() {
        return ResponseEntity.ok(ApiResponse.ok("Users retrieved successfully", userService.getAllUsers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Users retrieved successfully", userService.getUserById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponseDTO>> createUser(@Valid @RequestBody UserRequestDTO user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(ApiResponse.created("User created successfully", userService.createUser(user)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> updateUser(@PathVariable Long id,
                                                                   @Valid @RequestBody UserRequestDTO user) {
        return ResponseEntity.ok(ApiResponse.ok("User updated successfully", userService.updateUser(id, user)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDTO>> partialUpdateUser(@PathVariable Long id,
                                                                          @RequestBody UserRequestDTO user) {
        return ResponseEntity.ok(ApiResponse.ok("User updated successfully", userService.partialUpdateUser(id, user)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.noContent("User deleted successfully"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteAllUser() {
        userService.deleteAllUsers();
        return ResponseEntity.ok(ApiResponse.noContent("Users deleted successfully"));
    }
}
