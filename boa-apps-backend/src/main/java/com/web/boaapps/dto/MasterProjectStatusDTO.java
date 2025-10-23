package com.web.boaapps.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MasterProjectStatusDTO {
    private Long id;
    private String name;
    private String createdBy;
    private LocalDateTime createdAt;
}
