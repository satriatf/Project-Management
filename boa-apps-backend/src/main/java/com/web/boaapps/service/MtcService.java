package com.web.boaapps.service;

import com.web.boaapps.dto.MtcRequest;
import com.web.boaapps.entity.Mtc;
import com.web.boaapps.entity.User;
import com.web.boaapps.repository.MasterApplicationRepository;
import com.web.boaapps.repository.MasterNonProjectTypeRepository;
import com.web.boaapps.repository.MtcRepository;
import com.web.boaapps.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MtcService {
    private final MtcRepository repo;
    private final MasterNonProjectTypeRepository typeRepo;
    private final MasterApplicationRepository appRepo;
    private final UserRepository userRepo;

    public MtcService(MtcRepository repo, MasterNonProjectTypeRepository typeRepo, MasterApplicationRepository appRepo, UserRepository userRepo) {
        this.repo = repo; this.typeRepo = typeRepo; this.appRepo = appRepo; this.userRepo = userRepo;
    }

    public List<Mtc> all(){ 
        return repo.findAll().stream()
            .filter(m -> !m.getIsDelete())
            .toList();
    }
    public Mtc get(Long id){ 
        return repo.findById(id)
            .filter(m -> !m.getIsDelete())
            .orElseThrow(()->new RuntimeException("Non-Project not found with id: " + id));
    }

    public Mtc create(MtcRequest req){
        // validate type & app and resolve IDs
        var type = typeRepo.findByName(req.getType()).orElseThrow(()->new RuntimeException("Invalid type"));
        var app = appRepo.findByName(req.getApplication()).orElseThrow(()->new RuntimeException("Invalid application"));
        // validate createdBy, resolver: SH or Staff
        User createdBy = userRepo.findById(req.getCreatedById()).orElseThrow(()->new RuntimeException("createdBy not found"));
        if (!(createdBy.getLevel().equals("SH") || createdBy.getLevel().equals("Staff"))) {
            throw new RuntimeException("createdBy must be SH or Staff");
        }
        if (req.getResolverId()!=null) {
            User resolver = userRepo.findById(req.getResolverId()).orElseThrow(()->new RuntimeException("resolver not found"));
            if (!(resolver.getLevel().equals("SH") || resolver.getLevel().equals("Staff"))) {
                throw new RuntimeException("resolver must be SH or Staff");
            }
        }
        Mtc m = new Mtc();
        m.setCreatedById(req.getCreatedById());
        m.setResolverId(req.getResolverId());
        m.setNoTiket(req.getNoTiket());
        m.setDeskripsi(req.getDeskripsi());
    m.setType(req.getType()); // denormalized for UI
    m.setTypeId(type.getId());
        m.setSolusi(req.getSolusi());
    m.setApplication(req.getApplication()); // denormalized for UI
    m.setApplicationId(app.getId());
        m.setTanggal(req.getTanggal());
        m.setAttachmentsJson(req.getAttachmentsJson());
        m.setAttachmentsCount(req.getAttachmentsCount()==null?0:req.getAttachmentsCount());
        m.setIsDelete(false); // Explicitly set is_delete to false
        m.setCreatedAt(LocalDateTime.now());
        m.setUpdatedAt(LocalDateTime.now());
        return repo.save(m);
    }

    public Mtc update(Long id, MtcRequest req){
        Mtc m = get(id);
        if (req.getType()!=null) {
            var type = typeRepo.findByName(req.getType()).orElseThrow(()->new RuntimeException("Invalid type"));
            m.setType(req.getType());
            m.setTypeId(type.getId());
        }
        if (req.getApplication()!=null) {
            var app = appRepo.findByName(req.getApplication()).orElseThrow(()->new RuntimeException("Invalid application"));
            m.setApplication(req.getApplication());
            m.setApplicationId(app.getId());
        }
        if (req.getCreatedById()!=null) {
            User c = userRepo.findById(req.getCreatedById()).orElseThrow(()->new RuntimeException("createdBy not found"));
            if (!(c.getLevel().equals("SH") || c.getLevel().equals("Staff"))) throw new RuntimeException("createdBy must be SH or Staff");
            m.setCreatedById(req.getCreatedById());
        }
        if (req.getResolverId()!=null) {
            User r = userRepo.findById(req.getResolverId()).orElseThrow(()->new RuntimeException("resolver not found"));
            if (!(r.getLevel().equals("SH") || r.getLevel().equals("Staff"))) throw new RuntimeException("resolver must be SH or Staff");
            m.setResolverId(req.getResolverId());
        }
        if (req.getNoTiket()!=null) m.setNoTiket(req.getNoTiket());
        if (req.getDeskripsi()!=null) m.setDeskripsi(req.getDeskripsi());
    // type handled above
        if (req.getSolusi()!=null) m.setSolusi(req.getSolusi());
    // application handled above
        if (req.getTanggal()!=null) m.setTanggal(req.getTanggal());
        // Attachments update/clear logic with physical file cleanup
        if (req.getAttachmentsCount()!=null) {
            // When client explicitly sends 0, clear attachments AND delete physical files
            if (req.getAttachmentsCount() == 0) {
                deletePhysicalFiles(m.getAttachmentsJson());
                m.setAttachmentsJson(null);
                m.setAttachmentsCount(Short.valueOf((short)0));
            } else {
                // count > 0 → detect removed files and delete them
                deleteRemovedFiles(m.getAttachmentsJson(), req.getAttachmentsJson());
                m.setAttachmentsJson(req.getAttachmentsJson());
                m.setAttachmentsCount(req.getAttachmentsCount());
            }
        } else if (req.getAttachmentsJson()!=null) {
            // If only JSON sent, check for removed files
            deleteRemovedFiles(m.getAttachmentsJson(), req.getAttachmentsJson());
            m.setAttachmentsJson(req.getAttachmentsJson());
        }
        m.setUpdatedAt(LocalDateTime.now());
        return repo.save(m);
    }

    public void delete(Long id){ 
        Mtc m = repo.findById(id).orElseThrow(
            ()->new RuntimeException("Non-Project not found with id: " + id));
        
        // Delete physical files before deleting record
        if (m.getAttachmentsJson() != null && !m.getAttachmentsJson().isEmpty()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(m.getAttachmentsJson());
                Path uploadDir = Paths.get("public","file","non-projects").toAbsolutePath();
                
                if (root.isArray()) {
                    for (JsonNode fileNode : root) {
                        String filename = fileNode.has("name") ? fileNode.get("name").asText() : null;
                        if (filename != null && !filename.isEmpty()) {
                            Path filePath = uploadDir.resolve(filename);
                            try {
                                if (Files.exists(filePath)) {
                                    Files.delete(filePath);
                                    System.out.println("Deleted file: " + filePath);
                                }
                            } catch (IOException e) {
                                System.err.println("Failed to delete file: " + filePath + ", error: " + e.getMessage());
                            }
                        }
                    }
                } else if (root.isObject()) {
                    // Single file (legacy)
                    String filename = root.has("name") ? root.get("name").asText() : null;
                    if (filename != null && !filename.isEmpty()) {
                        Path filePath = uploadDir.resolve(filename);
                        try {
                            if (Files.exists(filePath)) {
                                Files.delete(filePath);
                                System.out.println("Deleted file: " + filePath);
                            }
                        } catch (IOException e) {
                            System.err.println("Failed to delete file: " + filePath + ", error: " + e.getMessage());
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Failed to parse attachmentsJson for cleanup: " + e.getMessage());
                // Continue with record deletion even if file cleanup fails
            }
        }
        
        // Permanent delete
        repo.delete(m);
    }

    // Helper: Delete physical files given JSON string
    private void deletePhysicalFiles(String attachmentsJson) {
        if (attachmentsJson == null || attachmentsJson.isEmpty()) return;
        
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(attachmentsJson);
            Path uploadDir = Paths.get("public","file","non-projects").toAbsolutePath();
            
            if (root.isArray()) {
                for (JsonNode fileNode : root) {
                    deleteFile(fileNode, uploadDir);
                }
            } else if (root.isObject()) {
                deleteFile(root, uploadDir);
            }
        } catch (Exception e) {
            System.err.println("Failed to delete physical files: " + e.getMessage());
        }
    }

    // Helper: Delete files that were removed (compare old vs new JSON)
    private void deleteRemovedFiles(String oldJson, String newJson) {
        if (oldJson == null || oldJson.isEmpty()) return;
        if (newJson == null || newJson.isEmpty()) {
            deletePhysicalFiles(oldJson);
            return;
        }
        
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode oldRoot = mapper.readTree(oldJson);
            JsonNode newRoot = mapper.readTree(newJson);
            
            java.util.Set<String> newFilenames = new java.util.HashSet<>();
            if (newRoot.isArray()) {
                for (JsonNode node : newRoot) {
                    if (node.has("name")) newFilenames.add(node.get("name").asText());
                }
            } else if (newRoot.isObject() && newRoot.has("name")) {
                newFilenames.add(newRoot.get("name").asText());
            }
            
            Path uploadDir = Paths.get("public","file","non-projects").toAbsolutePath();
            
            if (oldRoot.isArray()) {
                for (JsonNode fileNode : oldRoot) {
                    String filename = fileNode.has("name") ? fileNode.get("name").asText() : null;
                    if (filename != null && !newFilenames.contains(filename)) {
                        deleteFile(fileNode, uploadDir);
                    }
                }
            } else if (oldRoot.isObject()) {
                String filename = oldRoot.has("name") ? oldRoot.get("name").asText() : null;
                if (filename != null && !newFilenames.contains(filename)) {
                    deleteFile(oldRoot, uploadDir);
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to compare and delete removed files: " + e.getMessage());
        }
    }

    // Helper: Delete a single file given JSON node
    private void deleteFile(JsonNode fileNode, Path uploadDir) {
        String filename = fileNode.has("name") ? fileNode.get("name").asText() : null;
        if (filename != null && !filename.isEmpty()) {
            Path filePath = uploadDir.resolve(filename);
            try {
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                    System.out.println("Deleted file: " + filePath);
                }
            } catch (IOException e) {
                System.err.println("Failed to delete file: " + filePath + ", error: " + e.getMessage());
            }
        }
    }
}
