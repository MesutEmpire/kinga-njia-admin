package com.kinganjia.backend.repository;

import com.kinganjia.backend.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {
    @Query("SELECT i FROM Image i LEFT JOIN FETCH i.claim WHERE i.id = :id")
    Optional<Image> findById(@Param("id") Long id);
    
    @Query("SELECT i FROM Image i LEFT JOIN FETCH i.claim WHERE i.claim.id = :claimId")
    Optional<List<Image>> findByClaimId(@Param("claimId") Long claimId);
}
