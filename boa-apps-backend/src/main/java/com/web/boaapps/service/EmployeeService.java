package main.java.com.web.boaapps.service;

import com.web.boaapps.dto.EmployeeDTO;
import com.web.boaapps.entity.User;
import com.web.boaapps.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {
    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public EmployeeService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public List<EmployeeDTO> getAllEmployees(String level) {
        List<User> all = repo.findAll();
        if (level != null && !level.isBlank()) {
            String lv = level.trim();
            all = all.stream()
                    .filter(u -> u.getLevel() != null && u.getLevel().equalsIgnoreCase(lv))
                    .toList();
        }
        return all.stream().map(u -> this.toDTO(u)).collect(Collectors.toList());
    }

    public EmployeeDTO getEmployeeById(Long id) {
        User u = repo.findById(id).orElseThrow(() -> 
            new RuntimeException("Employee not found with id: " + id));
        return toDTO(u);
    }

    public EmployeeDTO createEmployee(User u, Long currentUserId) {
        // Set default values if not provided
        if (u.getIsActive() == null || u.getIsActive().isBlank()) {
            u.setIsActive("Active");
        }
        if (u.getLevel() == null || u.getLevel().isBlank()) {
            u.setLevel("Staff");
        }
        if (u.getPassword() != null && !u.getPassword().isBlank()) {
            u.setPassword(encoder.encode(u.getPassword()));
        }
        u.setCreatedBy(currentUserId);
        u.setCreatedAt(LocalDateTime.now());
        u.setUpdatedAt(LocalDateTime.now());
        return toDTO(repo.save(u));
    }

    public EmployeeDTO updateEmployee(Long id, User u) {
        User x = repo.findById(id).orElseThrow(() -> 
            new RuntimeException("Employee not found with id: " + id));
        
        // Update fields only if they are provided and valid
        if (u.getEmployeeNik() != null) {
            x.setEmployeeNik(u.getEmployeeNik());
        }
        if (u.getEmployeeName() != null && !u.getEmployeeName().isBlank()) {
            x.setEmployeeName(u.getEmployeeName());
        }
        if (u.getEmployeeEmail() != null && !u.getEmployeeEmail().isBlank()) {
            x.setEmployeeEmail(u.getEmployeeEmail());
        }
        if (u.getIsActive() != null && !u.getIsActive().isBlank()) {
            x.setIsActive(u.getIsActive());
        }
        if (u.getLevel() != null && !u.getLevel().isBlank()) {
            x.setLevel(u.getLevel());
        }
        if (u.getJoinDate() != null) {
            x.setJoinDate(u.getJoinDate());
        }
        if (u.getEndDate() != null) {
            x.setEndDate(u.getEndDate());
        }
        if (u.getPassword() != null && !u.getPassword().isBlank()) {
            x.setPassword(encoder.encode(u.getPassword()));
        }
        x.setUpdatedAt(LocalDateTime.now());
        return toDTO(repo.save(x));
    }

    public void deleteEmployee(Long id) {
        User u = repo.findById(id).orElseThrow(() -> 
            new RuntimeException("Employee not found with id: " + id));
        // Permanent delete: Remove from database
        repo.delete(u);
    }

    private EmployeeDTO toDTO(User u) {
        String creatorName = u.getCreatedBy() != null 
            ? repo.findById(u.getCreatedBy()).map(x -> x.getEmployeeName()).orElse("-")
            : "-";
        return EmployeeDTO.builder()
            .id(u.getId())
            .employeeNik(u.getEmployeeNik())
            .employeeName(u.getEmployeeName())
            .employeeEmail(u.getEmployeeEmail())
            .level(u.getLevel())
            .isActive(u.getIsActive())
            .joinDate(u.getJoinDate())
            .endDate(u.getEndDate())
            .createdBy(creatorName)
            .createdAt(u.getCreatedAt())
            .updatedAt(u.getUpdatedAt())
            .build();
    }
}
