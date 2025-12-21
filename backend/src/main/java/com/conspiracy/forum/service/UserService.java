package com.conspiracy.forum.service;

import com.conspiracy.forum.dto.AuthPayload;
import com.conspiracy.forum.exception.UnauthorizedException;
import com.conspiracy.forum.exception.ValidationException;
import com.conspiracy.forum.model.Token;
import com.conspiracy.forum.model.User;
import com.conspiracy.forum.repository.TokenRepository;
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
    private final TokenRepository tokenRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private static final SecureRandom secureRandom = new SecureRandom();
    
    @Transactional
    public AuthPayload login(String username, String secretCode) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (!passwordEncoder.matches(secretCode, user.getSecretCode())) {
                throw new UnauthorizedException("Invalid username or secret code");
            }
            String token = generateToken(user);
            return new AuthPayload(user, token);
        } else {
            throw new UnauthorizedException("Invalid username or secret code");
        }
    }
    
    @Transactional
    public AuthPayload register(String username, String secretCode, Boolean anonymous) {
        if (userRepository.existsByUsername(username)) {
            throw new ValidationException("Username already exists");
        }
        
        if (secretCode.length() < 6) {
            throw new ValidationException("Secret code must be at least 6 characters");
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
        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);
        String tokenValue = Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
        
        Token token = new Token();
        token.setToken(tokenValue);
        token.setUser(user);
        tokenRepository.save(token);
        
        return tokenValue;
    }
    
    public Long extractUserIdFromToken(String tokenValue) {
        if (tokenValue == null) {
            return null;
        }
        try {
            Optional<Token> tokenOpt = tokenRepository.findByToken(tokenValue);
            return tokenOpt.map(token -> token.getUser().getId()).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }
}
