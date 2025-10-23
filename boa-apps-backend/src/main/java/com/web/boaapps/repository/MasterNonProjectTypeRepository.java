package com.web.boaapps.repository;

import com.web.boaapps.entity.MasterNonProjectType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MasterNonProjectTypeRepository extends JpaRepository<MasterNonProjectType, Long> {
    Optional<MasterNonProjectType> findByName(String name);
}
