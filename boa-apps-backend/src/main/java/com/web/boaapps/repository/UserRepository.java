package com.web.boaapps.repository;

import com.web.boaapps.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmployeeEmail(String employeeEmail);
    boolean existsByEmployeeNik(Integer employeeNik);
}
