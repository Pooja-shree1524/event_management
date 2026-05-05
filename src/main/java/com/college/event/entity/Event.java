package com.college.event.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    @Lob
    private String description;

    private LocalDateTime dateTime;

    @NotBlank
    private String venue;

    @NotBlank
    private String category; // Technical, Cultural, Sports, Academic

    private String organizerDetails;
    
    @Lob
    private String rules;
}
