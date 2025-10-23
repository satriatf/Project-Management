package com.web.boaapps.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class ProjectRequest {
    @NotBlank private String projectTicketNo;
    @NotBlank private String projectName;
    @NotBlank private String projectStatus;
    @NotBlank private String technicalLead;
    private String picsJson;
    private LocalDate startDate;
    private LocalDate endDate;
    @NotNull private Integer totalDay;
    @NotNull private Short percentDone;

    public String getProjectTicketNo(){return projectTicketNo;}
    public void setProjectTicketNo(String v){this.projectTicketNo=v;}
    public String getProjectName(){return projectName;}
    public void setProjectName(String v){this.projectName=v;}
    public String getProjectStatus(){return projectStatus;}
    public void setProjectStatus(String v){this.projectStatus=v;}
    public String getTechnicalLead(){return technicalLead;}
    public void setTechnicalLead(String v){this.technicalLead=v;}
    public String getPicsJson(){return picsJson;}
    public void setPicsJson(String v){this.picsJson=v;}
    public LocalDate getStartDate(){return startDate;}
    public void setStartDate(LocalDate v){this.startDate=v;}
    public LocalDate getEndDate(){return endDate;}
    public void setEndDate(LocalDate v){this.endDate=v;}
    public Integer getTotalDay(){return totalDay;}
    public void setTotalDay(Integer v){this.totalDay=v;}
    public Short getPercentDone(){return percentDone;}
    public void setPercentDone(Short v){this.percentDone=v;}
}
