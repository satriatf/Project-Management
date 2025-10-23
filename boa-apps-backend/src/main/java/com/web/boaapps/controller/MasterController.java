package com.web.boaapps.controller;

import com.web.boaapps.dto.*;
import com.web.boaapps.entity.*;
import com.web.boaapps.service.MasterService;
import com.web.boaapps.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/master")
public class MasterController {
    private final MasterService svc;
    private final UserRepository userRepo;
    public MasterController(MasterService svc, UserRepository userRepo){ this.svc = svc; this.userRepo = userRepo; }

    private Long currentUserId() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getName()==null) return null;
            return userRepo.findByEmployeeEmail(auth.getName()).map(u->u.getId()).orElse(null);
        } catch (Exception e) { return null; }
    }

    @GetMapping("/project-statuses")
    public ResponseEntity<ApiResponse<List<MasterProjectStatusDTO>>> statuses(){
        return ResponseEntity.ok(ApiResponse.ok(svc.allStatuses()));
    }
    @PostMapping("/project-statuses")
    public ResponseEntity<ApiResponse<MasterProjectStatusDTO>> addStatus(@RequestBody Map<String,String> body, Principal p){
        String name = Optional.ofNullable(body.get("name")).map(String::trim).orElse("");
        if (name.isBlank()) throw new RuntimeException("name is required");
        return ResponseEntity.ok(ApiResponse.ok(svc.addStatus(name, currentUserId())));
    }
    @DeleteMapping("/project-statuses/{id}")
    public ResponseEntity<ApiResponse<String>> delStatus(@PathVariable Long id){
        svc.deleteStatus(id);
        return ResponseEntity.ok(ApiResponse.ok("deleted"));
    }

    @GetMapping("/non-project-types")
    public ResponseEntity<ApiResponse<List<MasterNonProjectTypeDTO>>> types(){
        return ResponseEntity.ok(ApiResponse.ok(svc.allTypes()));
    }
    @PostMapping("/non-project-types")
    public ResponseEntity<ApiResponse<MasterNonProjectTypeDTO>> addType(@RequestBody Map<String,String> body, Principal p){
        String name = Optional.ofNullable(body.get("name")).map(String::trim).orElse("");
        if (name.isBlank()) throw new RuntimeException("name is required");
        return ResponseEntity.ok(ApiResponse.ok(svc.addType(name, currentUserId())));
    }
    @DeleteMapping("/non-project-types/{id}")
    public ResponseEntity<ApiResponse<String>> delType(@PathVariable Long id){
        svc.deleteType(id);
        return ResponseEntity.ok(ApiResponse.ok("deleted"));
    }

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<List<MasterApplicationDTO>>> apps(){
        return ResponseEntity.ok(ApiResponse.ok(svc.allApps()));
    }
    @PostMapping("/applications")
    public ResponseEntity<ApiResponse<MasterApplicationDTO>> addApp(@RequestBody Map<String,String> body, Principal p){
        String name = Optional.ofNullable(body.get("name")).map(String::trim).orElse("");
        if (name.isBlank()) throw new RuntimeException("name is required");
        return ResponseEntity.ok(ApiResponse.ok(svc.addApp(name, currentUserId())));
    }
    @DeleteMapping("/applications/{id}")
    public ResponseEntity<ApiResponse<String>> delApp(@PathVariable Long id){
        svc.deleteApp(id);
        return ResponseEntity.ok(ApiResponse.ok("deleted"));
    }

    @GetMapping("/holidays")
    public ResponseEntity<ApiResponse<List<HolidayDTO>>> holidays(){
        return ResponseEntity.ok(ApiResponse.ok(svc.allHolidays()));
    }
    @PostMapping("/holidays")
    public ResponseEntity<ApiResponse<HolidayDTO>> addHoliday(@RequestBody Holiday h, Principal p){
        if (h.getDate()==null || h.getDescription()==null || h.getDescription().isBlank())
            throw new RuntimeException("date and description are required");
        return ResponseEntity.ok(ApiResponse.ok(svc.addHoliday(h, currentUserId())));
    }
    @DeleteMapping("/holidays/{id}")
    public ResponseEntity<ApiResponse<String>> delHoliday(@PathVariable Long id){
        svc.deleteHoliday(id);
        return ResponseEntity.ok(ApiResponse.ok("deleted"));
    }
}
