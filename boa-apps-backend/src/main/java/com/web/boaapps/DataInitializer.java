package com.web.boaapps;

import com.web.boaapps.entity.*;
import com.web.boaapps.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(UserRepository users,
                               MasterProjectStatusRepository statusRepo,
                               MasterNonProjectTypeRepository typeRepo,
                               MasterApplicationRepository appRepo,
                               HolidayRepository holidayRepo,
                               PasswordEncoder encoder){
        return args -> {
            users.findByEmployeeEmail("v.satria.ferdiansyah@adira.co.id").ifPresentOrElse(u -> {
                // Ensure fields are correct if the record already exists
                boolean changed = false;
                if (u.getEmployeeNik() == null || u.getEmployeeNik() != 51223639) { u.setEmployeeNik(51223639); changed = true; }
                if (u.getEmployeeName() == null || !u.getEmployeeName().equals("Satria Tri Ferdiansyah")) { u.setEmployeeName("Satria Tri Ferdiansyah"); changed = true; }
                if (u.getLevel() == null || !u.getLevel().equals("Staff")) { u.setLevel("Staff"); changed = true; }
                if (u.getIsActive() == null || !u.getIsActive().equals("Active")) { u.setIsActive("Active"); changed = true; }
                if (u.getJoinDate() == null) { u.setJoinDate(java.time.LocalDate.now()); changed = true; }
                if (changed) { u.setUpdatedAt(LocalDateTime.now()); users.save(u); }
            }, () -> {
                // Seed requested user so login works as specified by the user
                User stf = User.builder()
                        .employeeNik(51223639)
                        .employeeName("Satria Tri Ferdiansyah")
                        .employeeEmail("v.satria.ferdiansyah@adira.co.id")
                        .password(encoder.encode("51223639"))
                        .isActive("Active")
                        .level("Staff")
                        .joinDate(java.time.LocalDate.now())
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                users.save(stf);
            });

            // statuses
            if (statusRepo.findAll().isEmpty()) {
                for (String s : List.of("DEV","QC","GO LIVE")) {
                    MasterProjectStatus st = new MasterProjectStatus();
                    st.setName(s); st.setCreatedBy(1L);
                    st.setCreatedAt(LocalDateTime.now()); st.setUpdatedAt(LocalDateTime.now());
                    statusRepo.save(st);
                }
            }
            // non project types
            if (typeRepo.findAll().isEmpty()) {
                for (String s : List.of("PROBLEM","INCIDENT","SERVICE REQUEST")) {
                    MasterNonProjectType t = new MasterNonProjectType();
                    t.setName(s); t.setCreatedBy(1L);
                    t.setCreatedAt(LocalDateTime.now()); t.setUpdatedAt(LocalDateTime.now());
                    typeRepo.save(t);
                }
            }
            // applications
            if (appRepo.findAll().isEmpty()) {
                for (String s : List.of("Ad1Access","Ivanti Service Desk","Ad1Suite","Ad1ForFlow","E-Recruitment")) {
                    MasterApplication a = new MasterApplication();
                    a.setName(s); a.setCreatedBy(1L);
                    a.setCreatedAt(LocalDateTime.now()); a.setUpdatedAt(LocalDateTime.now());
                    appRepo.save(a);
                }
            }
            // holidays
            if (holidayRepo.findAll().isEmpty()) {
                Holiday h1 = Holiday.builder().date(LocalDate.of(2025,12,25)).description("Natal").createdBy(1L).createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build();
                Holiday h2 = Holiday.builder().date(LocalDate.of(2025,12,31)).description("Tahun Baru").createdBy(1L).createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build();
                holidayRepo.save(h1); holidayRepo.save(h2);
            }
        };
    }
}
