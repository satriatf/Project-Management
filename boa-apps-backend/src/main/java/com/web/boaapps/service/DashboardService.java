package com.web.boaapps.service;

import com.web.boaapps.repository.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {
    private final UserRepository userRepo;
    private final ProjectRepository projectRepo;
    private final MtcRepository mtcRepo;
    private final MasterApplicationRepository appRepo;
    private final MasterProjectStatusRepository statusRepo;
    private final MasterNonProjectTypeRepository typeRepo;
    private final HolidayRepository holidayRepo;

    public DashboardService(UserRepository userRepo, ProjectRepository projectRepo, MtcRepository mtcRepo,
                            MasterApplicationRepository appRepo, HolidayRepository holidayRepo,
                            MasterProjectStatusRepository statusRepo, MasterNonProjectTypeRepository typeRepo) {
        this.userRepo = userRepo; this.projectRepo = projectRepo; this.mtcRepo = mtcRepo; this.appRepo = appRepo; this.holidayRepo = holidayRepo; this.statusRepo = statusRepo; this.typeRepo = typeRepo;
    }

    public Map<String,Object> counts() {
        Map<String,Object> m = new HashMap<>();
        // Only count active/visible entries similar to list endpoints
        long employees = userRepo.findAll().stream().filter(u -> u.getDeletedAt()==null && "Active".equalsIgnoreCase(u.getIsActive())).count();
        long projects = projectRepo.findAll().stream().filter(p -> !p.getIsDelete()).count();
        long nonProjects = mtcRepo.findAll().stream().filter(n -> !n.getIsDelete()).count();
        long appCount = appRepo.findAll().stream().filter(a -> a.getDeletedAt()==null).count();
        long holidays = holidayRepo.findAll().stream().filter(h -> h.getDeletedAt()==null).count();
        long statuses = statusRepo.findAll().stream().filter(s -> s.getDeletedAt()==null).count();
        long types = typeRepo.findAll().stream().filter(t -> t.getDeletedAt()==null).count();

        m.put("employees", employees);
        m.put("projects", projects);
        m.put("nonProjects", nonProjects);
        m.put("applications", appCount);
        m.put("masters", appCount + statuses + types);
        m.put("holidays", holidays);
        return m;
    }
}
