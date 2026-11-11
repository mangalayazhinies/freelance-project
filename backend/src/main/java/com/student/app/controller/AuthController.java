package com.student.app.controller;

import com.student.app.model.User;
import com.student.app.repo.UserRepo;
import com.student.app.security.JwtHelper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtHelper jwtHelper;

    public AuthController(UserRepo userRepo, PasswordEncoder passwordEncoder, JwtHelper jwtHelper) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtHelper = jwtHelper;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");

        if (name == null || email == null || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please enter all details"));
        }
        if (userRepo.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already in use"));
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepo.save(user);

        return ResponseEntity.ok(makeResponse(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        User user = userRepo.findByEmail(email).orElse(null);

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Wrong email or password"));
        }

        return ResponseEntity.ok(makeResponse(user));
    }

    private Map<String, Object> makeResponse(User user) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("token", jwtHelper.createToken(user.getEmail()));
        result.put("userId", user.getId());
        result.put("name", user.getName());
        result.put("email", user.getEmail());
        return result;
    }
}
