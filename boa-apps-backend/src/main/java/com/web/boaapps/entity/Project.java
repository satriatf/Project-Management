package com.web.boaapps.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
// Relations
import com.web.boaapps.entity.MasterProjectStatus;
import com.web.boaapps.entity.User;
// JSON
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name="projects")
@JsonIgnoreProperties({"status", "technicalLeadUser", "pic", "hibernateLazyInitializer", "handler"})
public class Project {
    @Id
    @Column(name="sk_project", columnDefinition = "uuid")
    private UUID id;

    @PrePersist
    public void prePersist() {
        if (id == null) id = java.util.UUID.randomUUID();
    }

    @Column(name="project_ticket_no", nullable=false)
    private String projectTicketNo;

    @Column(name="project_name", nullable=false)
    private String projectName;

    // Denormalized for backward-compatibility (UI currently sends status name)
    @Column(name="project_status", nullable=false)
    private String projectStatus;

    // New normalized relation to master_project_statuses
    @Column(name = "status_id")
    private Long statusId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", insertable = false, updatable = false)
    private MasterProjectStatus status;

    @Column(name="technical_lead")
    private String technicalLead; // denormalized name for current UI

    @Column(name = "technical_lead_id")
    private Long technicalLeadId; // normalized FK to users

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technical_lead_id", insertable = false, updatable = false)
    private User technicalLeadUser;

    @Column(name="pics")
    private String picsJson; // JSON array of PIC names (UI supports multi-select)

    // Optional primary PIC relation (single) for normalized schema
    @Column(name = "pic_id")
    private Long picId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pic_id", insertable = false, updatable = false)
    private User pic;

    private LocalDate startDate;
    private LocalDate endDate;

    @Column(name="total_day", nullable=false)
    private Integer totalDay = 0;

    @Column(name="percent_done", nullable=false)
    private Short percentDone = 0;

    @Column(name="is_delete", nullable=false)
    private Boolean isDelete = false;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
