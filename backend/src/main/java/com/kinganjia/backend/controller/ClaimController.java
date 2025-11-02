package com.kinganjia.backend.controller;

import com.kinganjia.backend.dto.ClaimRequestDTO;
import com.kinganjia.backend.dto.ClaimResponseDTO;
import com.kinganjia.backend.dto.ImageResponseDTO;
import com.kinganjia.backend.dto.response.ApiResponse;
import com.kinganjia.backend.service.ClaimService;
import com.kinganjia.backend.service.ImageService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/claims")
@Slf4j
public class ClaimController {
    private final ClaimService claimService;
    private final ImageService imageService;

    public ClaimController(ClaimService claimService, ImageService imageService) {
        this.claimService = claimService;
        this.imageService = imageService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClaimResponseDTO>>> getClaims() {
        return ResponseEntity.ok(ApiResponse.ok("Claims retrieved successfully", claimService.getAllClaims()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClaimResponseDTO>> getClaimById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Claims retrieved successfully", claimService.getClaimById(id)));
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<ApiResponse<List<ImageResponseDTO>>> getClaimImages(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Claim images retrieved successfully", imageService.getClaimByClaimId(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClaimResponseDTO>> createClaim(@Valid @RequestBody ClaimRequestDTO claim) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(ApiResponse.created("Claim created successfully", claimService.createClaim(claim)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClaimResponseDTO>> updateClaim(@PathVariable Long id,
                                                                   @Valid @RequestBody ClaimRequestDTO claim) {
        return ResponseEntity.ok(ApiResponse.ok("Claim updated successfully", claimService.updateClaim(id, claim)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<ClaimResponseDTO>> partialUpdateClaim(@PathVariable Long id,
                                                                          @RequestBody ClaimRequestDTO claim) {
        return ResponseEntity.ok(ApiResponse.ok("Claim updated successfully", claimService.partialUpdateClaim(id, claim)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteClaim(@PathVariable Long id) {
        claimService.deleteClaim(id);
        return ResponseEntity.ok(ApiResponse.noContent("Claim deleted successfully"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteAllClaim() {
        claimService.deleteAllClaims();
        return ResponseEntity.ok(ApiResponse.noContent("Claims deleted successfully"));
    }
}
