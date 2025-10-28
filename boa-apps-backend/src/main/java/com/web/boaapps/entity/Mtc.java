package com.web.boaapps.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
// Relations
import com.web.boaapps.entity.User;
import com.web.boaapps.entity.MasterNonProjectType;
import com.web.boaapps.entity.MasterApplication;
// JSON
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name="mtcs")
@JsonIgnoreProperties({"createdBy", "resolver", "typeRef", "applicationRef", "hibernateLazyInitializer", "handler"})
public class Mtc {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="sk_mtc")
    private Long id;

    @Column(name="created_by_id", nullable=false)
    private Long createdById;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", insertable = false, updatable = false)
    private User createdBy;

    @Column(name="resolver_id")
    private Long resolverId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolver_id", insertable = false, updatable = false)
    private User resolver;

    @Column(name="no_tiket", unique=true, nullable=false)
    private String noTiket;

    @Column(name="deskripsi", columnDefinition="text", nullable=false)
    private String deskripsi;

    @Column(name="type", nullable=false)
    private String type; // denormalized name

    @Column(name = "type_id")
    private Long typeId; // normalized FK

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id", insertable = false, updatable = false)
    private MasterNonProjectType typeRef;

    @Column(name="solusi", columnDefinition="text")
    private String solusi;

    @Column(name="application", nullable=false)
    private String application; // denormalized name

    @Column(name = "application_id")
    private Long applicationId; // normalized FK

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", insertable = false, updatable = false)
    private MasterApplication applicationRef;

    @Column(name="tanggal", nullable=false)
    private LocalDate tanggal;

    @Column(name="attachments", columnDefinition="text")
    private String attachmentsJson;

    @Column(name="attachments_count", nullable=false)
    private Short attachmentsCount = 0;

    @Column(name="is_delete", nullable=false)
    private Boolean isDelete = false;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
