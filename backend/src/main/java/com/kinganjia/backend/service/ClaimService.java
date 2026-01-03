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
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ClaimService {
    private final ClaimRepository claimRepository;
    private final ClaimMapper claimMapper;
    private final UserRepository userRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");

    public List<ClaimResponseDTO> getAllClaims() {
        List<Claim> claims = claimRepository.findAll();
        return claims.stream().map(claimMapper::toResponse).collect(Collectors.toList());
    }

    public ClaimResponseDTO getClaimById(Long id) {
        Claim claim = claimRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + id));
        return claimMapper.toResponse(claim);
    }

    public List<ClaimResponseDTO> getClaimByUserId(Long id) {
        List<Claim> claims = claimRepository.findByUserId(id)
            .orElseThrow(() -> new ResourceNotFoundException("No claims found for user with id: " + id));
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
        return claimRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public String generateClaimsCSV() {
        List<Claim> claims = claimRepository.findAll();
        
        StringBuilder csv = new StringBuilder();
        csv.append("\uFEFF");
        csv.append("\"Claim ID\",\"User Name\",\"User Email\",\"Location\",\"Created Date\",\"Status\",\"Severity\",\"Description\",\"Detection Type\",\"Hash\",\"Images Count\"\n");
        
        for (Claim claim : claims) {
            csv.append(escapeCsvValue(String.valueOf(claim.getId()))).append(",");
            csv.append(escapeCsvValue(claim.getUser().getFirstName() + " " + claim.getUser().getLastName())).append(",");
            csv.append(escapeCsvValue(claim.getUser().getEmail())).append(",");
            csv.append(escapeCsvValue(claim.getLocation())).append(",");
            csv.append(escapeCsvValue(claim.getCreatedAt().format(DATE_FORMATTER))).append(",");
            csv.append(escapeCsvValue(claim.getStatus().name())).append(",");
            csv.append(escapeCsvValue(claim.getSeverity().name())).append(",");
            csv.append(escapeCsvValue(claim.getDescription())).append(",");
            csv.append(escapeCsvValue(claim.getDetectionType().name())).append(",");
            csv.append(escapeCsvValue(claim.getHash())).append(",");
            csv.append(escapeCsvValue(String.valueOf(claim.getImages() != null ? claim.getImages().size() : 0)));
            csv.append("\n");
        }
        
        return csv.toString();
    }

    private String escapeCsvValue(String value) {
        if (value == null) {
            return "\"\"";
        }
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }
}