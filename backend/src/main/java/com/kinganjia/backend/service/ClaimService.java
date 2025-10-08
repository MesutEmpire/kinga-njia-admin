package com.kinganjia.backend.service;

import com.kinganjia.backend.model.Claim;
import com.kinganjia.backend.repository.ClaimRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClaimService {
    private final ClaimRepository claimRepository;

    public ClaimService(ClaimRepository claimRepository) {
        this.claimRepository = claimRepository;
    }

    public Optional<Claim> findById(Long id) {
        return claimRepository.findById(id);
    }

    public Optional<List<Claim>> findByUserId(Long userId) {
        return claimRepository.findByUserId(userId);
    }

    public Claim createClaim(Claim claim) {
        return claimRepository.save(claim);
    }

    public Claim updateClaim(Claim claim) {
        return claimRepository.save(claim);
    }

    public void deleteClaimById(Long id) {
        claimRepository.deleteById(id);
    }
}
