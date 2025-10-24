package com.web.boaapps.controller;

import com.web.boaapps.dto.ApiResponse;
import com.web.boaapps.dto.MtcRequest;
import com.web.boaapps.entity.Mtc;
import com.web.boaapps.service.MtcService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/non-projects")
public class MtcController {
    private final MtcService svc;
    private static final String UPLOAD_DIR = "public/file/non-projects/";
    
    public MtcController(MtcService svc){ 
        this.svc = svc;
        // Create upload directory if it doesn't exist
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

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

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(
            @RequestParam("file") MultipartFile file) {
        
        if (file.isEmpty()) {
            throw new RuntimeException("Please select a file to upload");
        }

        try {
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            // Save file
            Path targetLocation = Paths.get(UPLOAD_DIR + uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return file info
            Map<String, String> fileInfo = new HashMap<>();
            fileInfo.put("name", uniqueFilename);
            fileInfo.put("originalName", originalFilename);
            fileInfo.put("size", String.valueOf(file.getSize()));
            fileInfo.put("type", file.getContentType());
            fileInfo.put("url", "/api/non-projects/files/" + uniqueFilename);

            return ResponseEntity.ok(ApiResponse.ok(fileInfo));
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
    }

    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                throw new RuntimeException("File not found: " + filename);
            }

            // Determine content type
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            throw new RuntimeException("Error downloading file: " + e.getMessage());
        }
    }
}
