package com.buyone.userservice.service;

import com.buyone.userservice.request.RegisterUserRequest;
import com.buyone.userservice.request.UpdateUserRequest;
import com.buyone.userservice.response.UserResponse;
import com.buyone.userservice.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    UserResponse createUser(RegisterUserRequest request);
    Optional<UserResponse> getUserById(String id);
    Optional<User> getUserEntityByEmail(String email); // Internal
    List<UserResponse> getAllUsers();
    UserResponse updateUser(String id, UpdateUserRequest request);
    User getUserEntityById(String id); // Internal
    void deleteUser(String id);
}


// Methods should use DTOs for incoming and outgoing data (except for internal lookups).