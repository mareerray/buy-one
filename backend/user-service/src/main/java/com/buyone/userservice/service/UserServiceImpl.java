package com.buyone.userservice.service;

import com.buyone.userservice.model.User;
import com.buyone.userservice.repository.UserRepository;
import com.buyone.userservice.request.RegisterUserRequest;
import com.buyone.userservice.request.UpdateUserRequest;
import com.buyone.userservice.response.UserResponse;
import com.buyone.userservice.exception.BadRequestException;
import com.buyone.userservice.exception.ConflictException;
import com.buyone.userservice.exception.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public UserResponse createUser(RegisterUserRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new BadRequestException("Email cannot be empty");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ConflictException("Email already exists: " + request.getEmail());
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Password cannot be empty");
        }
        
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .avatar(request.getAvatar())
                .build();
        
        User savedUser = userRepository.save(user);
        return toUserResponse(savedUser);
    }
    
    @Override
    public Optional<UserResponse> getUserById(String id) {
        return userRepository.findById(id)
                .map(this::toUserResponse)
                .or(() -> {
                    throw new ResourceNotFoundException("User not found with ID " + id);
                });
    }
    
    @Override
    public Optional<User> getUserEntityByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new BadRequestException("Email must not be empty");
        }
        return userRepository.findByEmail(email)
                .or(() -> { throw new ResourceNotFoundException("No user found with email: " + email); });
    }
    
    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users found");
        }
        return users.stream()
                .filter(u -> u.getEmail() != null && u.getRole() != null)
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public UserResponse updateUser(String id, UpdateUserRequest request) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        if (request.getEmail() != null && userRepository.findByEmail(request.getEmail()).isPresent()
                && !request.getEmail().equals(existingUser.getEmail())) {
            throw new ConflictException("Email already exists: " + request.getEmail());
        }
        
        if (request.getName() != null ) {
            existingUser.setName(request.getName());
        }
        if (request.getEmail() != null) {
            existingUser.setEmail(request.getEmail());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRole() != null) {
            existingUser.setRole(request.getRole());
        }
        if (request.getAvatar() != null) {
            existingUser.setAvatar(request.getAvatar());
        }
        
        User updatedUser = userRepository.save(existingUser);
        return toUserResponse(updatedUser);
    }
    
    @Override
    public User getUserEntityById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }
    
    @Override
    @Transactional
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete — user not found with ID: " + id);
        }
        // Cascade deletes/logic for related entities if needed
        userRepository.deleteById(id);
    }
    
    // Mapping helper
    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .avatar(user.getAvatar())
                .build();
    }
}
