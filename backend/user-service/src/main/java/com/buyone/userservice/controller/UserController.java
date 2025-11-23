package com.buyone.userservice.controller;

import com.buyone.userservice.request.UpdateUserRequest;
import com.buyone.userservice.response.UserResponse;
import com.buyone.userservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    // GET /api/users/{id} - Find user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(); // ResourceNotFoundException will be handled globally
    }
    
    // GET /api/users - List all users
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    // PUT /api/users/{id} - Update user info
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRequest updateUserRequest) {
        UserResponse updated = userService.updateUser(id, updateUserRequest);
        return ResponseEntity.ok(updated);
    }
    
    // DELETE /api/users/{id} - Delete user by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
