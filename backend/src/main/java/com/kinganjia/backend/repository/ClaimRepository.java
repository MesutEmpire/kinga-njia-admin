package com.kinganjia.backend.repository;

import com.kinganjia.backend.model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    Optional<List<Claim>> findByUserId(Long userId);
}
