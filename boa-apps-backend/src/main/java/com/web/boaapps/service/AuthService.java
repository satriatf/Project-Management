package com.web.boaapps.service;

import com.web.boaapps.config.JwtService;
import com.web.boaapps.dto.AuthRequest;
import com.web.boaapps.dto.AuthResponse;
import com.web.boaapps.entity.User;
import com.web.boaapps.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(UserRepository userRepo, PasswordEncoder encoder, JwtService jwt) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public AuthResponse login(AuthRequest request) {
        User u = userRepo.findByEmployeeEmail(request.getEmail()).orElseThrow(
                ()->new RuntimeException("Invalid credentials"));
        if (!encoder.matches(request.getPassword(), u.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        Map<String,Object> claims = new HashMap<>();
        claims.put("uid", u.getId());
        claims.put("level", u.getLevel());
        String token = jwt.generateToken(u.getEmployeeEmail(), claims);
        return new AuthResponse("success", token, u);
    }

    public User register(User user) {
        if (userRepo.findByEmployeeEmail(user.getEmployeeEmail()).isPresent())
            throw new RuntimeException("Email already used");
        user.setPassword(encoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepo.save(user);
    }
}
