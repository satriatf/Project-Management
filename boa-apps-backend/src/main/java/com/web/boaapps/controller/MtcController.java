package com.web.boaapps.controller;

import com.web.boaapps.dto.ApiResponse;
import com.web.boaapps.dto.MtcRequest;
import com.web.boaapps.entity.Mtc;
import com.web.boaapps.service.MtcService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/non-projects")
public class MtcController {
    private final MtcService svc;
    public MtcController(MtcService svc){ this.svc = svc; }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Mtc>>> all(){
        return ResponseEntity.ok(ApiResponse.ok(svc.all()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Mtc>> get(@PathVariable Long id){
        return ResponseEntity.ok(ApiResponse.ok(svc.get(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Mtc>> create(@RequestBody @Valid MtcRequest req){
        return ResponseEntity.ok(ApiResponse.ok(svc.create(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Mtc>> update(@PathVariable Long id, @RequestBody MtcRequest req){
        return ResponseEntity.ok(ApiResponse.ok(svc.update(id, req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Long id){
        svc.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("deleted"));
    }
}
