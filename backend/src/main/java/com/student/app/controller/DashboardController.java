package com.student.app.controller;

import com.student.app.model.User;
import com.student.app.repo.ClientRepo;
import com.student.app.repo.ProjectRepo;
import com.student.app.repo.TaskRepo;
import com.student.app.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private ClientRepo clientRepo;

    @Autowired
    private ProjectRepo projectRepo;

    @Autowired
    private TaskRepo taskRepo;

    @Autowired
    private UserRepo userRepo;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(Authentication auth) {

        String email = auth.getName();
        User user = userRepo.findByEmail(email).orElseThrow();
        Long userId = user.getId();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalClients",       clientRepo.countByUserId(userId));
        stats.put("totalProjects",      projectRepo.countByUserId(userId));
        stats.put("activeProjects",     projectRepo.countByUserIdAndStatus(userId, "IN_PROGRESS"));
        stats.put("completedProjects",  projectRepo.countByUserIdAndStatus(userId, "COMPLETED"));
        stats.put("totalTasks",         taskRepo.countByProjectUserId(userId));
        stats.put("pendingTasks",       taskRepo.countByProjectUserIdAndStatus(userId, "TODO"));
        stats.put("inProgressTasks",    taskRepo.countByProjectUserIdAndStatus(userId, "IN_PROGRESS"));
        stats.put("doneTasks",          taskRepo.countByProjectUserIdAndStatus(userId, "DONE"));

        return ResponseEntity.ok(stats);
    }
}
