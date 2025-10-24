package com.web.boaapps.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EmployeeDTO {
    private Long id;
    private Integer employeeNik;
    private String employeeName;
    private String employeeEmail;
    private String level;
    private String isActive;
    private LocalDate joinDate;
    private LocalDate endDate;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
