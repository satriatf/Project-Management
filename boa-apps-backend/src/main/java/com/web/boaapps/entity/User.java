package com.web.boaapps.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="sk_user")
    private Long id;

    @Column(name="employee_nik", unique = true)
    private Integer employeeNik;

    @Column(name="employee_name", length=100, nullable=false)
    private String employeeName;

    @Column(name="employee_email", length=100, nullable=false, unique=true)
    private String employeeEmail;

    @Column(nullable=false)
    private String password;

    @Column(name="is_active", nullable=false)
    private String isActive = "Active"; // Active/Inactive

    @Column(nullable=false)
    private String level = "Staff"; // Manager, Asmen, SH, Staff, Intern

    private LocalDate joinDate;
    private LocalDate endDate;

    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
