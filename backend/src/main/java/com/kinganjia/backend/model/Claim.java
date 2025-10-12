package com.kinganjia.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "claims",indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "created_at"),
    @Index(name = "idx_hash", columnList = "hash")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user","images"})
@EqualsAndHashCode(exclude = {"user","images"})
public class Claim {
    @OneToMany(mappedBy = "claim", cascade = {
            CascadeType.PERSIST,
            CascadeType.MERGE
    },
            orphanRemoval = false)
    List<Image> images;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
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

