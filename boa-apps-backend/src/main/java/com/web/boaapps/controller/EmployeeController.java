package com.web.boaapps.controller;

import com.web.boaapps.dto.ApiResponse;
import com.web.boaapps.dto.EmployeeDTO;
import com.web.boaapps.entity.User;
import com.web.boaapps.repository.UserRepository;
import com.web.boaapps.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService service;
    private final UserRepository userRepo;

    public EmployeeController(EmployeeService service, UserRepository userRepo){
        this.service = service; this.userRepo = userRepo;
    }

    private Long currentUserId() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getName()==null) return null;
            return userRepo.findByEmployeeEmail(auth.getName()).map(u->u.getId()).orElse(null);
        } catch (Exception e) { return null; }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> all(@RequestParam(value = "level", required = false) String level){
        return ResponseEntity.ok(ApiResponse.ok(service.getAllEmployees(level)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> get(@PathVariable Long id){
        return ResponseEntity.ok(ApiResponse.ok(service.getEmployeeById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeDTO>> create(@RequestBody User u){
        return ResponseEntity.ok(ApiResponse.ok(service.createEmployee(u, currentUserId())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> update(@PathVariable Long id, @RequestBody User u){
        return ResponseEntity.ok(ApiResponse.ok(service.updateEmployee(id, u)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Long id){
        service.deleteEmployee(id);
        return ResponseEntity.ok(ApiResponse.ok("Employee successfully deleted permanently"));
    }
}
