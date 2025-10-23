package com.web.boaapps.repository;

import com.web.boaapps.entity.MasterProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MasterProjectStatusRepository extends JpaRepository<MasterProjectStatus, Long> {
    Optional<MasterProjectStatus> findByName(String name);
}
