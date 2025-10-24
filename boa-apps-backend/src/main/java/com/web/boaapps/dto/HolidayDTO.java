package com.web.boaapps.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HolidayDTO {
    private Long id;
    private LocalDate date;
    private String description;
    private String createdBy;
    private LocalDateTime createdAt;
}
