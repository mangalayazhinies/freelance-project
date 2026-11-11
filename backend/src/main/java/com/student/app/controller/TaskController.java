package com.student.app.controller;

import com.student.app.model.Project;
import com.student.app.model.Task;
import com.student.app.model.User;
import com.student.app.repo.ProjectRepo;
import com.student.app.repo.TaskRepo;
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
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepo taskRepo;

    @Autowired
    private ProjectRepo projectRepo;

    @Autowired
    private UserRepo userRepo;

    private User getCurrentUser(Authentication auth) {
        return userRepo.findByEmail(auth.getName()).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(Authentication auth) {
        Long userId = getCurrentUser(auth).getId();
        return ResponseEntity.ok(taskRepo.findByProjectUserId(userId));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(
            @PathVariable Long projectId,
            Authentication auth) {
        return ResponseEntity.ok(taskRepo.findByProjectId(projectId));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createTask(
            @RequestBody Map<String, Object> body,
            Authentication auth) {

        User user = getCurrentUser(auth);

        Long projectId = Long.valueOf(body.get("projectId").toString());
        Optional<Project> project = projectRepo.findById(projectId);

        if (project.isEmpty() || !project.get().getUser().getId().equals(user.getId())) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Project not found");
            return ResponseEntity.badRequest().body(err);
        }

        Task task = new Task();
        task.setTitle(body.get("title").toString());
        task.setDescription(body.getOrDefault("description", "").toString());
        task.setStatus(body.getOrDefault("status", "TODO").toString());
        task.setProject(project.get());

        if (body.get("dueDate") != null && !body.get("dueDate").toString().isEmpty()) {
            task.setDueDate(LocalDate.parse(body.get("dueDate").toString()));
        }

        taskRepo.save(task);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Task created");
        response.put("task", task);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTask(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            Authentication auth) {

        User user = getCurrentUser(auth);

        Optional<Task> found = taskRepo.findById(id);
        if (found.isEmpty() || !found.get().getProject().getUser().getId().equals(user.getId())) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Task not found");
            return ResponseEntity.status(404).body(err);
        }

        Task task = found.get();
        if (body.get("title") != null)       task.setTitle(body.get("title").toString());
        if (body.get("description") != null) task.setDescription(body.get("description").toString());
        if (body.get("status") != null)      task.setStatus(body.get("status").toString());
        if (body.get("dueDate") != null && !body.get("dueDate").toString().isEmpty()) {
            task.setDueDate(LocalDate.parse(body.get("dueDate").toString()));
        }

        taskRepo.save(task);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Task updated");
        response.put("task", task);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTask(
            @PathVariable Long id,
            Authentication auth) {

        User user = getCurrentUser(auth);

        Optional<Task> found = taskRepo.findById(id);
        if (found.isEmpty() || !found.get().getProject().getUser().getId().equals(user.getId())) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Task not found");
            return ResponseEntity.status(404).body(err);
        }

        taskRepo.deleteById(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Task deleted");
        return ResponseEntity.ok(response);
    }
}
