package com.college.event.controller;

import com.college.event.entity.Event;
import com.college.event.entity.Registration;
import com.college.event.entity.User;
import com.college.event.repository.EventRepository;
import com.college.event.repository.RegistrationRepository;
import com.college.event.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @GetMapping
    public ResponseEntity<List<Registration>> getAllRegistrations() {
        List<Registration> registrations = registrationRepository.findAll();
        return ResponseEntity.ok(registrations);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Registration>> getRegistrationsByUserId(@PathVariable Long userId) {
        List<Registration> registrations = registrationRepository.findByUserId(userId);
        return ResponseEntity.ok(registrations);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Registration>> getRegistrationsByEventId(@PathVariable Long eventId) {
        List<Registration> registrations = registrationRepository.findByEventId(eventId);
        return ResponseEntity.ok(registrations);
    }

    @PostMapping
    public ResponseEntity<?> createRegistration(@RequestBody Registration registration) {
        try {
            if (registration.getUser() == null || registration.getUser().getId() == null) {
                return ResponseEntity.badRequest().body("User ID is required");
            }
            if (registration.getEvent() == null || registration.getEvent().getId() == null) {
                return ResponseEntity.badRequest().body("Event ID is required");
            }

            Optional<User> userOpt = userRepository.findById(registration.getUser().getId());
            Optional<Event> eventOpt = eventRepository.findById(registration.getEvent().getId());

            if (userOpt.isEmpty() || eventOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User or Event not found");
            }

            registration.setUser(userOpt.get());
            registration.setEvent(eventOpt.get());
            if (registration.getStatus() == null) {
                registration.setStatus("PENDING");
            }

            Registration savedRegistration = registrationRepository.save(registration);
            return ResponseEntity.ok(savedRegistration);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating registration: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRegistration(@PathVariable Long id, @RequestBody Registration registrationDetails) {
        Optional<Registration> regOpt = registrationRepository.findById(id);
        if (regOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Registration registration = regOpt.get();
        if (registrationDetails.getStatus() != null) {
            registration.setStatus(registrationDetails.getStatus());
        }

        Registration updatedRegistration = registrationRepository.save(registration);
        return ResponseEntity.ok(updatedRegistration);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRegistration(@PathVariable Long id) {
        if (!registrationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        registrationRepository.deleteById(id);
        return ResponseEntity.ok("Registration deleted successfully");
    }
}
