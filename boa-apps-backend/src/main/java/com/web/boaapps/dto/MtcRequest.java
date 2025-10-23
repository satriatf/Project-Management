package com.web.boaapps.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class MtcRequest {
    @NotNull private Long createdById;
    private Long resolverId;
    @NotBlank private String noTiket;
    @NotBlank private String deskripsi;
    @NotBlank private String type;
    private String solusi;
    @NotBlank private String application;
    @NotNull private LocalDate tanggal;
    private String attachmentsJson;
    private Short attachmentsCount;

    public Long getCreatedById(){return createdById;}
    public void setCreatedById(Long v){this.createdById=v;}
    public Long getResolverId(){return resolverId;}
    public void setResolverId(Long v){this.resolverId=v;}
    public String getNoTiket(){return noTiket;}
    public void setNoTiket(String v){this.noTiket=v;}
    public String getDeskripsi(){return deskripsi;}
    public void setDeskripsi(String v){this.deskripsi=v;}
    public String getType(){return type;}
    public void setType(String v){this.type=v;}
    public String getSolusi(){return solusi;}
    public void setSolusi(String v){this.solusi=v;}
    public String getApplication(){return application;}
    public void setApplication(String v){this.application=v;}
    public LocalDate getTanggal(){return tanggal;}
    public void setTanggal(LocalDate v){this.tanggal=v;}
    public String getAttachmentsJson(){return attachmentsJson;}
    public void setAttachmentsJson(String v){this.attachmentsJson=v;}
    public Short getAttachmentsCount(){return attachmentsCount;}
    public void setAttachmentsCount(Short v){this.attachmentsCount=v;}
}
