package com.kinganjia.backend.repository;

import com.kinganjia.backend.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {
    Optional<List<Image>> findByClaimId(Long claimId);
}
