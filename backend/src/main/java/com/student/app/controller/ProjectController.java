package com.student.app.controller;

import com.student.app.model.Client;
import com.student.app.model.Project;
import com.student.app.model.User;
import com.student.app.repo.ClientRepo;
import com.student.app.repo.ProjectRepo;
import com.student.app.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepo projectRepo;

    @Autowired
    private ClientRepo clientRepo;

    @Autowired
    private UserRepo userRepo;

    private User getCurrentUser(Authentication auth) {
        return userRepo.findByEmail(auth.getName()).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects(Authentication auth) {
        Long userId = getCurrentUser(auth).getId();
        return ResponseEntity.ok(projectRepo.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createProject(
            @RequestBody Map<String, Object> body,
            Authentication auth) {

        User user = getCurrentUser(auth);

        Long clientId = Long.valueOf(body.get("clientId").toString());
        Optional<Client> client = clientRepo.findById(clientId);

        if (client.isEmpty()) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Client not found");
            return ResponseEntity.badRequest().body(err);
        }

        Project project = new Project();
        project.setName(body.get("name").toString());
        project.setDescription(body.getOrDefault("description", "").toString());
        project.setStatus(body.getOrDefault("status", "PLANNED").toString());
        project.setUser(user);
        project.setClient(client.get());

        // Parse deadline if provided
        if (body.get("deadline") != null && !body.get("deadline").toString().isEmpty()) {
            project.setDeadline(LocalDate.parse(body.get("deadline").toString()));
        }

        // Parse budget if provided
        if (body.get("budget") != null && !body.get("budget").toString().isEmpty()) {
            project.setBudget(Double.valueOf(body.get("budget").toString()));
        }

        projectRepo.save(project);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Project created");
        response.put("project", project);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProject(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            Authentication auth) {

        User user = getCurrentUser(auth);

        Optional<Project> found = projectRepo.findById(id);
        if (found.isEmpty() || !found.get().getUser().getId().equals(user.getId())) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Project not found");
            return ResponseEntity.status(404).body(err);
        }

        Project project = found.get();
        project.setName(body.get("name").toString());
        project.setDescription(body.getOrDefault("description", "").toString());
        project.setStatus(body.getOrDefault("status", "PLANNED").toString());

        if (body.get("deadline") != null && !body.get("deadline").toString().isEmpty()) {
            project.setDeadline(LocalDate.parse(body.get("deadline").toString()));
        }
        if (body.get("budget") != null && !body.get("budget").toString().isEmpty()) {
            project.setBudget(Double.valueOf(body.get("budget").toString()));
        }

        projectRepo.save(project);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Project updated");
        response.put("project", project);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProject(
            @PathVariable Long id,
            Authentication auth) {

        User user = getCurrentUser(auth);

        Optional<Project> found = projectRepo.findById(id);
        if (found.isEmpty() || !found.get().getUser().getId().equals(user.getId())) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Project not found");
            return ResponseEntity.status(404).body(err);
        }

        projectRepo.deleteById(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Project deleted");
        return ResponseEntity.ok(response);
    }
}
