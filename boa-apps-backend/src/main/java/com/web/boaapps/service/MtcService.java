package com.web.boaapps.service;

import com.web.boaapps.dto.MtcRequest;
import com.web.boaapps.entity.Mtc;
import com.web.boaapps.entity.User;
import com.web.boaapps.repository.MasterApplicationRepository;
import com.web.boaapps.repository.MasterNonProjectTypeRepository;
import com.web.boaapps.repository.MtcRepository;
import com.web.boaapps.repository.UserRepository;
import org.springframework.stereotype.Service;

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
        if (req.getAttachmentsJson()!=null) m.setAttachmentsJson(req.getAttachmentsJson());
        if (req.getAttachmentsCount()!=null) m.setAttachmentsCount(req.getAttachmentsCount());
        m.setUpdatedAt(LocalDateTime.now());
        return repo.save(m);
    }

    public void delete(Long id){ 
        Mtc m = repo.findById(id).orElseThrow(
            ()->new RuntimeException("Non-Project not found with id: " + id));
        // Permanent delete
        repo.delete(m);
    }
}
