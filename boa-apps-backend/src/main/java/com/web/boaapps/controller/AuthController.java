package com.web.boaapps.controller;

import com.web.boaapps.dto.ApiResponse;
import com.web.boaapps.dto.AuthRequest;
import com.web.boaapps.dto.AuthResponse;
import com.web.boaapps.entity.User;
import com.web.boaapps.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;

    public AuthController(AuthService auth){ this.auth = auth; }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid AuthRequest req){
        AuthResponse res = auth.login(req);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@RequestBody User u){
        return ResponseEntity.ok(ApiResponse.ok(auth.register(u)));
    }
}
