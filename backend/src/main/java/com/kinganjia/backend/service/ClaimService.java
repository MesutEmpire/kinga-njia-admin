package com.kinganjia.backend.service;

import com.kinganjia.backend.dto.ClaimRequestDTO;
import com.kinganjia.backend.dto.ClaimResponseDTO;
import com.kinganjia.backend.exception.ResourceNotFoundException;
import com.kinganjia.backend.mapper.ClaimMapper;
import com.kinganjia.backend.model.Claim;
import com.kinganjia.backend.repository.ClaimRepository;
import com.kinganjia.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClaimService {
    private final ClaimRepository claimRepository;
    private final ClaimMapper claimMapper;
    private final UserRepository userRepository;

    public List<ClaimResponseDTO> getAllClaims() {
        List<Claim> claims = claimRepository.findAll();
        return claims.stream().map(claimMapper::toResponse).collect(Collectors.toList());
    }

    public ClaimResponseDTO getClaimById(Long id) {
        Claim claim = claimRepository.findById(id).orElseThrow(() -> new RuntimeException("Claim not found"));
        return claimMapper.toResponse(claim);
    }

    public List<ClaimResponseDTO> getClaimByUserIdl(Long id) {
        List<Claim> claims =claimRepository.findByUserId(id).orElseThrow(() -> new RuntimeException("Claim not found"));
        return claims.stream().map(claimMapper::toResponse).collect(Collectors.toList());
    }

    public ClaimResponseDTO createClaim(ClaimRequestDTO claimDTO) {
        if (!userRepository.existsById(claimDTO.getUserId())) {
            throw new ResourceNotFoundException("User not found");
        }
        log.info("Create claim DTO {}", claimDTO);
        Claim claim = claimMapper.toEntity(claimDTO);
        log.info("Create claim {}", claim);
        Claim createdClaim = claimRepository.save(claim);
        return claimMapper.toResponse(createdClaim);
    }

    public ClaimResponseDTO updateClaim(Long id, ClaimRequestDTO claimDTO) {
        Claim existingClaim = findClaimById(id);
        claimMapper.fullUpdateClaimFromDto(claimDTO, existingClaim);
        log.info("Claim update : {}",existingClaim);
        Claim updatedClaim = claimRepository.save(existingClaim);
        return claimMapper.toResponse(updatedClaim);
    }

    public ClaimResponseDTO partialUpdateClaim(Long id, ClaimRequestDTO claimUpdate) {
        Claim existingClaim = findClaimById(id);
        claimMapper.updateClaimFromDto(claimUpdate,existingClaim);
        log.info("Claim partial update : {}",existingClaim);
        Claim updatedClaim = claimRepository.save(existingClaim);
        return claimMapper.toResponse(updatedClaim);
    }

    public void deleteClaim(Long id) {
        claimRepository.deleteById(id);
    }

    public void deleteAllClaims() {
        claimRepository.deleteAll();
    }

    private Claim findClaimById(Long id){
        return claimRepository.findById(id).orElseThrow(() -> new RuntimeException("Claim not found with id: " + id));
    }
}
