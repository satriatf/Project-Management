package com.web.boaapps.controller;

import com.web.boaapps.dto.ApiResponse;
import com.web.boaapps.dto.ProjectRequest;
import com.web.boaapps.entity.Project;
import com.web.boaapps.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService svc;
    public ProjectController(ProjectService svc){ this.svc = svc; }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Project>>> all(){
        return ResponseEntity.ok(ApiResponse.ok(svc.all()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> get(@PathVariable UUID id){
        return ResponseEntity.ok(ApiResponse.ok(svc.get(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Project>> create(@RequestBody @Valid ProjectRequest req){
        return ResponseEntity.ok(ApiResponse.ok(svc.create(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> update(@PathVariable UUID id, @RequestBody ProjectRequest req){
        return ResponseEntity.ok(ApiResponse.ok(svc.update(id, req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable UUID id){
        svc.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("deleted"));
    }
}
