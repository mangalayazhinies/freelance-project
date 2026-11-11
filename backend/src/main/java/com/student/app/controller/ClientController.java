package com.student.app.controller;

import com.student.app.model.Client;
import com.student.app.model.User;
import com.student.app.repo.ClientRepo;
import com.student.app.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientRepo clientRepo;

    @Autowired
    private UserRepo userRepo;

    private User getCurrentUser(Authentication auth) {
        String email = auth.getName(); // email was stored in JWT token
        return userRepo.findByEmail(email).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<Client>> getAllClients(Authentication auth) {
        Long userId = getCurrentUser(auth).getId();
        List<Client> clients = clientRepo.findByUserId(userId);
        return ResponseEntity.ok(clients);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createClient(
            @RequestBody Map<String, String> body,
            Authentication auth) {

        User user = getCurrentUser(auth);

        Client client = new Client();
        client.setName(body.get("name"));
        client.setEmail(body.get("email"));
        client.setPhone(body.get("phone"));
        client.setCompany(body.get("company"));
        client.setUser(user); // link to current user

        clientRepo.save(client);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Client added successfully");
        response.put("client", client);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateClient(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication auth) {

        User user = getCurrentUser(auth);

        Optional<Client> found = clientRepo.findById(id);
        if (found.isEmpty() || !found.get().getUser().getId().equals(user.getId())) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Client not found");
            return ResponseEntity.status(404).body(err);
        }

        Client client = found.get();
        client.setName(body.get("name"));
        client.setEmail(body.get("email"));
        client.setPhone(body.get("phone"));
        client.setCompany(body.get("company"));
        clientRepo.save(client);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Client updated");
        response.put("client", client);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteClient(
            @PathVariable Long id,
            Authentication auth) {

        User user = getCurrentUser(auth);

        Optional<Client> found = clientRepo.findById(id);
        if (found.isEmpty() || !found.get().getUser().getId().equals(user.getId())) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Client not found");
            return ResponseEntity.status(404).body(err);
        }

        clientRepo.deleteById(id);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Client deleted");
        return ResponseEntity.ok(response);
    }
}
