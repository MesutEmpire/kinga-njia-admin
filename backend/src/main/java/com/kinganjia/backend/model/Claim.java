package com.kinganjia.backend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "claims")
public class Claim {
    @OneToMany(mappedBy = "claim", cascade = CascadeType.ALL)
    List<Image> images;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Enumerated(EnumType.STRING)
    private ClaimStatus status;

    @Column(nullable = false)
    private String hash;

    @Enumerated(EnumType.STRING)
    private SeverityLevel severity;

    private String description;

    @Column(name = "detection_type")
    @Enumerated(EnumType.STRING)
    private DetectionType detectionType;

    @Column(name = "confirmation_time")
    private LocalDateTime confirmationTime;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

