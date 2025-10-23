package com.web.boaapps.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.web.boaapps.entity.Mtc;
import com.web.boaapps.entity.Project;
import com.web.boaapps.repository.MtcRepository;
import com.web.boaapps.repository.ProjectRepository;
import com.web.boaapps.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TimelineService {
    private final ProjectRepository projectRepo;
    private final MtcRepository mtcRepo;
    private final ObjectMapper om = new ObjectMapper();
    private final UserRepository userRepo;

    public TimelineService(ProjectRepository projectRepo, MtcRepository mtcRepo, UserRepository userRepo) {
        this.projectRepo = projectRepo; this.mtcRepo = mtcRepo; this.userRepo = userRepo;
    }

    public List<Map<String,Object>> timeline() {
        List<Map<String,Object>> out = new ArrayList<>();

        for (Project p : projectRepo.findAll()) {
            // One for technical lead
            Map<String,Object> lead = new LinkedHashMap<>();
            // prefer normalized relation name if exists
            String leadName = p.getTechnicalLead();
            try {
                if (p.getTechnicalLeadId() != null) {
                    var u = userRepo.findById(p.getTechnicalLeadId());
                    if (u.isPresent() && u.get().getEmployeeName()!=null) leadName = u.get().getEmployeeName();
                }
            } catch (Exception ignored) {}
            lead.put("employeeName", leadName);
            lead.put("taskType", "Project");
            lead.put("color", "blue");
            lead.put("startDate", p.getStartDate());
            lead.put("endDate", p.getEndDate());
            lead.put("detail", p);
            out.add(lead);

            // For each PIC
            try {
                List<String> pics = p.getPicsJson()==null? List.of() : om.readValue(p.getPicsJson(), new TypeReference<List<String>>(){});
                for (String pic : pics) {
                    Map<String,Object> m = new LinkedHashMap<>();
                    m.put("employeeName", pic);
                    m.put("taskType", "Project");
                    m.put("color", "blue");
                    m.put("startDate", p.getStartDate());
                    m.put("endDate", p.getEndDate());
                    m.put("detail", p);
                    out.add(m);
                }
            } catch (Exception ignored) {}
        }

        for (Mtc m : mtcRepo.findAll()) {
            Map<String,Object> item = new LinkedHashMap<>();
            String resolverName = null;
            if (m.getResolverId()!=null) {
                var u = userRepo.findById(m.getResolverId());
                resolverName = u.map(user -> user.getEmployeeName()).orElse(null);
            }
            if (resolverName == null) resolverName = "Resolver#-";
            item.put("employeeName", resolverName);
            item.put("taskType", "Non-Project");
            item.put("color", "yellow");
            item.put("startDate", m.getTanggal());
            item.put("endDate", m.getTanggal());
            item.put("detail", m);
            out.add(item);
        }
        return out;
    }
}
