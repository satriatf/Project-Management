package com.web.boaapps.service;

import com.web.boaapps.entity.*;
import com.web.boaapps.repository.*;
import com.web.boaapps.dto.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MasterService {
    private final MasterProjectStatusRepository statusRepo;
    private final MasterNonProjectTypeRepository typeRepo;
    private final MasterApplicationRepository appRepo;
    private final HolidayRepository holidayRepo;
    private final UserRepository userRepo;

    public MasterService(MasterProjectStatusRepository statusRepo, MasterNonProjectTypeRepository typeRepo, MasterApplicationRepository appRepo, HolidayRepository holidayRepo, UserRepository userRepo) {
        this.statusRepo = statusRepo; this.typeRepo = typeRepo; this.appRepo = appRepo; this.holidayRepo = holidayRepo; this.userRepo = userRepo;
    }

    // statuses
    public List<MasterProjectStatusDTO> allStatuses() { 
        return statusRepo.findAll().stream()
            .filter(s -> s.getDeletedAt() == null)
            .map(this::toStatusDTO)
            .toList();
    }
    public MasterProjectStatusDTO addStatus(String name, Long uid) {
        MasterProjectStatus s = new MasterProjectStatus();
        s.setName(name); s.setCreatedBy(uid);
        s.setCreatedAt(LocalDateTime.now()); s.setUpdatedAt(LocalDateTime.now());
        return toStatusDTO(statusRepo.save(s));
    }
    private MasterProjectStatusDTO toStatusDTO(MasterProjectStatus s) {
        String creatorName = s.getCreatedBy() != null 
            ? userRepo.findById(s.getCreatedBy()).map(u -> u.getEmployeeName()).orElse("-")
            : "-";
        return MasterProjectStatusDTO.builder()
            .id(s.getId())
            .name(s.getName())
            .createdBy(creatorName)
            .createdAt(s.getCreatedAt())
            .build();
    }
    public void deleteStatus(Long id) { // soft delete
        MasterProjectStatus s = statusRepo.findById(id).orElseThrow(
            () -> new RuntimeException("Project Status not found with id: " + id));
        s.setDeletedAt(LocalDateTime.now());
        s.setUpdatedAt(LocalDateTime.now());
        statusRepo.save(s);
    }

    // types
    public List<MasterNonProjectTypeDTO> allTypes(){ 
        return typeRepo.findAll().stream()
            .filter(t -> t.getDeletedAt() == null)
            .map(this::toTypeDTO)
            .toList();
    }
    public MasterNonProjectTypeDTO addType(String name, Long uid){
        MasterNonProjectType t = new MasterNonProjectType();
        t.setName(name); t.setCreatedBy(uid);
        t.setCreatedAt(LocalDateTime.now()); t.setUpdatedAt(LocalDateTime.now());
        return toTypeDTO(typeRepo.save(t));
    }
    private MasterNonProjectTypeDTO toTypeDTO(MasterNonProjectType t) {
        String creatorName = t.getCreatedBy() != null 
            ? userRepo.findById(t.getCreatedBy()).map(u -> u.getEmployeeName()).orElse("-")
            : "-";
        return MasterNonProjectTypeDTO.builder()
            .id(t.getId())
            .name(t.getName())
            .createdBy(creatorName)
            .createdAt(t.getCreatedAt())
            .build();
    }
    public void deleteType(Long id){
        MasterNonProjectType t = typeRepo.findById(id).orElseThrow(
            () -> new RuntimeException("Non Project Type not found with id: " + id));
        t.setDeletedAt(LocalDateTime.now());
        t.setUpdatedAt(LocalDateTime.now());
        typeRepo.save(t);
    }

    // applications
    public List<MasterApplicationDTO> allApps(){ 
        return appRepo.findAll().stream()
            .filter(a -> a.getDeletedAt() == null)
            .map(this::toAppDTO)
            .toList();
    }
    public MasterApplicationDTO addApp(String name, Long uid){
        MasterApplication a = new MasterApplication();
        a.setName(name); a.setCreatedBy(uid);
        a.setCreatedAt(LocalDateTime.now()); a.setUpdatedAt(LocalDateTime.now());
        return toAppDTO(appRepo.save(a));
    }
    private MasterApplicationDTO toAppDTO(MasterApplication a) {
        String creatorName = a.getCreatedBy() != null 
            ? userRepo.findById(a.getCreatedBy()).map(u -> u.getEmployeeName()).orElse("-")
            : "-";
        return MasterApplicationDTO.builder()
            .id(a.getId())
            .name(a.getName())
            .createdBy(creatorName)
            .createdAt(a.getCreatedAt())
            .build();
    }
    public void deleteApp(Long id){
        MasterApplication a = appRepo.findById(id).orElseThrow(
            () -> new RuntimeException("Application not found with id: " + id));
        a.setDeletedAt(LocalDateTime.now());
        a.setUpdatedAt(LocalDateTime.now());
        appRepo.save(a);
    }

    // holidays
    public List<HolidayDTO> allHolidays(){ 
        return holidayRepo.findAll().stream()
            .filter(h -> h.getDeletedAt() == null)
            .map(this::toHolidayDTO)
            .toList();
    }
    public HolidayDTO addHoliday(Holiday h, Long uid){
        h.setCreatedBy(uid);
        h.setCreatedAt(LocalDateTime.now()); h.setUpdatedAt(LocalDateTime.now());
        return toHolidayDTO(holidayRepo.save(h));
    }
    private HolidayDTO toHolidayDTO(Holiday h) {
        String creatorName = h.getCreatedBy() != null 
            ? userRepo.findById(h.getCreatedBy()).map(u -> u.getEmployeeName()).orElse("-")
            : "-";
        return HolidayDTO.builder()
            .id(h.getId())
            .date(h.getDate())
            .description(h.getDescription())
            .createdBy(creatorName)
            .createdAt(h.getCreatedAt())
            .build();
    }
    public void deleteHoliday(Long id){
        Holiday h = holidayRepo.findById(id).orElseThrow(
            () -> new RuntimeException("Holiday not found with id: " + id));
        h.setDeletedAt(LocalDateTime.now());
        h.setUpdatedAt(LocalDateTime.now());
        holidayRepo.save(h);
    }
}
