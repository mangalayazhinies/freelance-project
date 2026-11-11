package com.student.app.repo;

import com.student.app.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepo extends JpaRepository<Task, Long> {

  
    List<Task> findByProjectId(Long projectId);

    List<Task> findByProjectUserId(Long userId);

    long countByProjectUserIdAndStatus(Long userId, String status);

    long countByProjectUserId(Long userId);
}
