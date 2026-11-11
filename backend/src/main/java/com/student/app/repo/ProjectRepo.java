package com.student.app.repo;

import com.student.app.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ProjectRepo extends JpaRepository<Project, Long> {

   
    List<Project> findByUserId(Long userId);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, String status);
}
