package com.web.boaapps.service;

import com.web.boaapps.dto.ProjectRequest;
import com.web.boaapps.entity.Project;
import com.web.boaapps.entity.User;
import com.web.boaapps.repository.MasterProjectStatusRepository;
import com.web.boaapps.repository.ProjectRepository;
import com.web.boaapps.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {
    private final ProjectRepository repo;
    private final MasterProjectStatusRepository statusRepo;
    private final UserRepository userRepo;

    public ProjectService(ProjectRepository repo, MasterProjectStatusRepository statusRepo, UserRepository userRepo) {
        this.repo = repo;
        this.statusRepo = statusRepo;
        this.userRepo = userRepo;
    }

    public List<Project> all(){ 
        return repo.findAll().stream()
            .filter(p -> !p.getIsDelete())
            .toList();
    }

    public Project get(UUID id){ 
        return repo.findById(id)
            .filter(p -> !p.getIsDelete())
            .orElseThrow(()->new RuntimeException("Project not found with id: " + id));
    }

    public Project create(ProjectRequest req) {
    // Resolve and validate status
    var status = statusRepo.findByName(req.getProjectStatus())
        .orElseThrow(() -> new RuntimeException("Invalid project_status"));
    // Resolve and validate technical lead (must be SH)
    User lead = userRepo.findAll().stream()
        .filter(u -> u.getEmployeeName().equals(req.getTechnicalLead()))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("Technical lead not found"));
    if (!"SH".equalsIgnoreCase(lead.getLevel())) throw new RuntimeException("technical_lead must be SH");

    Project p = new Project();
    p.setProjectTicketNo(req.getProjectTicketNo());
    p.setProjectName(req.getProjectName());
    // denormalized fields for UI
    p.setProjectStatus(req.getProjectStatus());
    p.setTechnicalLead(req.getTechnicalLead());
    // normalized relations
    p.setStatusId(status.getId());
    p.setTechnicalLeadId(lead.getId());

    p.setPicsJson(req.getPicsJson());
    p.setStartDate(req.getStartDate());
    p.setEndDate(req.getEndDate());
    p.setTotalDay(req.getTotalDay());
    p.setPercentDone(req.getPercentDone());
    p.setIsDelete(false); // Explicitly set is_delete to false
    p.setCreatedAt(LocalDateTime.now());
    p.setUpdatedAt(LocalDateTime.now());
    return repo.save(p);
    }

    public Project update(UUID id, ProjectRequest req) {
        Project p = get(id);
        if (req.getProjectStatus()!=null) {
            var status = statusRepo.findByName(req.getProjectStatus())
                    .orElseThrow(() -> new RuntimeException("Invalid project_status"));
            p.setProjectStatus(req.getProjectStatus());
            p.setStatusId(status.getId());
        }
        if (req.getTechnicalLead()!=null) {
            User lead = userRepo.findAll().stream()
                    .filter(u -> u.getEmployeeName().equals(req.getTechnicalLead()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Technical lead not found"));
            if (!"SH".equalsIgnoreCase(lead.getLevel())) throw new RuntimeException("technical_lead must be SH");
            p.setTechnicalLead(req.getTechnicalLead());
            p.setTechnicalLeadId(lead.getId());
        }
        if (req.getPicsJson()!=null) p.setPicsJson(req.getPicsJson());
        if (req.getProjectTicketNo()!=null) p.setProjectTicketNo(req.getProjectTicketNo());
        if (req.getProjectName()!=null) p.setProjectName(req.getProjectName());
        if (req.getStartDate()!=null) p.setStartDate(req.getStartDate());
        if (req.getEndDate()!=null) p.setEndDate(req.getEndDate());
        if (req.getTotalDay()!=null) p.setTotalDay(req.getTotalDay());
        if (req.getPercentDone()!=null) p.setPercentDone(req.getPercentDone());
        p.setUpdatedAt(LocalDateTime.now());
        return repo.save(p);
    }

    public void delete(UUID id){ 
        Project p = repo.findById(id).orElseThrow(
            ()->new RuntimeException("Project not found with id: " + id));
        // Permanent delete
        repo.delete(p);
    }
}
