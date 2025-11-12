package com.buyone.userservice.service;

import com.buyone.userservice.request.RegisterUserRequest;
import com.buyone.userservice.request.UpdateUserRequest;
import com.buyone.userservice.response.UserResponse;

public interface UserService {
    User createUser(User user);
    Optional<UserResponse> getUserById(String id);
    Optional<User> getUserByEmail(String email);
    List<UserResponse> getAllUsers();
    User updateUser(String id, User user);
    User getUserEntityById(String id);
    void deleteUser(String id);
}
