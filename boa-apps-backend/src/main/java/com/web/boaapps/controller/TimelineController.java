package com.web.boaapps.controller;

import com.web.boaapps.dto.ApiResponse;
import com.web.boaapps.service.TimelineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/timeline")
public class TimelineController {
    private final TimelineService svc;
    public TimelineController(TimelineService svc){ this.svc = svc; }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String,Object>>>> get(){
        return ResponseEntity.ok(ApiResponse.ok(svc.timeline()));
    }
}
