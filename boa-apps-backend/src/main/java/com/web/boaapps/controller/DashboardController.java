package com.web.boaapps.controller;

import com.web.boaapps.dto.ApiResponse;
import com.web.boaapps.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService svc;
    public DashboardController(DashboardService svc){ this.svc = svc; }

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> get(){
        return ResponseEntity.ok(ApiResponse.ok(svc.counts()));
    }
}
