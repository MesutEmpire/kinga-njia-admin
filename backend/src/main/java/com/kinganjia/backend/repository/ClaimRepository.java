package com.kinganjia.backend.repository;

import com.kinganjia.backend.model.Claim;
import com.kinganjia.backend.model.ClaimStatus;
import com.kinganjia.backend.model.SeverityLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    @Query("SELECT DISTINCT c FROM Claim c LEFT JOIN FETCH c.user LEFT JOIN FETCH c.images")
    List<Claim> findAll();
    
    @Query("SELECT c FROM Claim c LEFT JOIN FETCH c.user LEFT JOIN FETCH c.images WHERE c.id = :id")
    Optional<Claim> findById(@Param("id") Long id);
    
    @Query("SELECT DISTINCT c FROM Claim c LEFT JOIN FETCH c.user LEFT JOIN FETCH c.images WHERE c.user.id = :userId")
    Optional<List<Claim>> findByUserId(@Param("userId") Long userId);
    
    long countByStatus(ClaimStatus status);
    
    long countByCreatedAtAfter(LocalDateTime date);
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT DISTINCT c FROM Claim c LEFT JOIN FETCH c.user LEFT JOIN FETCH c.images WHERE c.createdAt BETWEEN :start AND :end")
    List<Claim> findByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT DISTINCT c FROM Claim c LEFT JOIN FETCH c.user LEFT JOIN FETCH c.images WHERE c.createdAt BETWEEN :start AND :end AND c.status = :status")
    List<Claim> findByCreatedAtBetweenAndStatus(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end, @Param("status") ClaimStatus status);
    
    long countBySeverity(SeverityLevel severity);
    
    @Query("SELECT c.location, COUNT(c) as claimCount FROM Claim c GROUP BY c.location ORDER BY claimCount DESC")
    List<Object[]> findTopLocations(@Param("limit") int limit);
    
    @Query("SELECT COUNT(c) FROM Claim c WHERE c.status = :status")
    long countByStatusCustom(@Param("status") ClaimStatus status);
    
    @Query("SELECT c FROM Claim c WHERE c.status = 'VERIFIED' AND c.updatedAt IS NOT NULL AND c.createdAt IS NOT NULL")
    List<Claim> findProcessedClaimsForMetrics();
    
    @Query("SELECT c.severity, COUNT(c) FROM Claim c WHERE c.createdAt BETWEEN :start AND :end GROUP BY c.severity")
    List<Object[]> countBySeverityAndPeriod(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT c.location, COUNT(c) FROM Claim c WHERE c.createdAt BETWEEN :start AND :end GROUP BY c.location ORDER BY COUNT(c) DESC")
    List<Object[]> findTopLocationsByPeriod(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
