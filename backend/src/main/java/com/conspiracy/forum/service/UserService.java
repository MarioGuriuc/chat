package com.conspiracy.forum.service;

import com.conspiracy.forum.dto.AuthPayload;
import com.conspiracy.forum.model.User;
import com.conspiracy.forum.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    
    @Transactional
    public AuthPayload login(String username, String secretCode, Boolean anonymous) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (!user.getSecretCode().equals(secretCode)) {
                throw new RuntimeException("Invalid secret code");
            }
            String token = generateToken(user);
            return new AuthPayload(user, token);
        } else {
            throw new RuntimeException("User not found");
        }
    }
    
    @Transactional
    public AuthPayload register(String username, String secretCode, Boolean anonymous) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }
        
        if (secretCode.length() < 6) {
            throw new RuntimeException("Secret code must be at least 6 characters");
        }
        
        User user = new User();
        user.setUsername(username);
        user.setSecretCode(secretCode);
        user.setIsAnonymous(anonymous != null ? anonymous : false);
        
        User savedUser = userRepository.save(user);
        String token = generateToken(savedUser);
        
        return new AuthPayload(savedUser, token);
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    private String generateToken(User user) {
        return UUID.randomUUID().toString() + "-" + user.getId();
    }
    
    public Long extractUserIdFromToken(String token) {
        if (token == null || !token.contains("-")) {
            return null;
        }
        try {
            String[] parts = token.split("-");
            return Long.parseLong(parts[parts.length - 1]);
        } catch (Exception e) {
            return null;
        }
    }
}
