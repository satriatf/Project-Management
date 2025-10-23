package com.web.boaapps.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MasterNonProjectTypeDTO {
    private Long id;
    private String name;
    private String createdBy;
    private LocalDateTime createdAt;
}
