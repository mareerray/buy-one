package com.buyone.userservice.auth;

import com.buyone.userservice.request.RegisterUserRequest;
import com.buyone.userservice.request.LoginRequest;
import com.buyone.userservice.response.UserResponse;
import com.buyone.userservice.response.LoginResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    private final AuthService authService;
    
    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    
    @PostMapping("/register")
    public UserResponse register(@RequestBody @Valid RegisterUserRequest request) {
        return authService.register(request);
    }
    
    @PostMapping("/login")
    public LoginResponse login(@RequestBody @Valid LoginRequest request) {
        return authService.login(request);
    }
}
