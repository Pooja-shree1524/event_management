package com.college.event.controller;

import com.college.event.entity.Role;
import com.college.event.entity.User;
import com.college.event.payload.request.LoginRequest;
import com.college.event.payload.request.SignupRequest;
import com.college.event.payload.response.JwtResponse;
import com.college.event.payload.response.MessageResponse;
import com.college.event.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    UserRepository userRepository;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
        }
        
        User user = userOpt.get();
        
        // Simple password check (in production, use password encoder)
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid password"));
        }

        return ResponseEntity.ok(new JwtResponse(
                "mock-token",
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().toString()
        ));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        Role roleValue = "admin".equalsIgnoreCase(signUpRequest.getRole()) ? Role.ROLE_ADMIN : Role.ROLE_STUDENT;
        
        User user = new User(
                signUpRequest.getName(),
                signUpRequest.getEmail(),
                signUpRequest.getPassword(),
                roleValue
        );

        userRepository.save(user);

        return ResponseEntity.ok(new JwtResponse(
                "mock-token",
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().toString()
        ));
    }
}
