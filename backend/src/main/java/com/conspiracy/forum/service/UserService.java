package com.conspiracy.forum.service;

import com.conspiracy.forum.dto.AuthPayload;
import com.conspiracy.forum.model.User;
import com.conspiracy.forum.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Transactional
    public AuthPayload login(String username, String secretCode) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (!passwordEncoder.matches(secretCode, user.getSecretCode())) {
                throw new RuntimeException("Invalid username or secret code");
            }
            String token = generateToken(user);
            return new AuthPayload(user, token);
        } else {
            throw new RuntimeException("Invalid username or secret code");
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
        user.setSecretCode(passwordEncoder.encode(secretCode));
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
        SecureRandom secureRandom = new SecureRandom();
        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);
        String randomToken = Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
        return randomToken + "-" + user.getId();
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
