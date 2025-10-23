package com.web.boaapps.repository;

import com.web.boaapps.entity.MasterApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MasterApplicationRepository extends JpaRepository<MasterApplication, Long> {
    Optional<MasterApplication> findByName(String name);
}
