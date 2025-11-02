package com.kinganjia.backend.controller;

import com.kinganjia.backend.dto.ImageRequestDTO;
import com.kinganjia.backend.dto.ImageResponseDTO;
import com.kinganjia.backend.dto.response.ApiResponse;
import com.kinganjia.backend.service.ImageService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/images")
@Slf4j
public class ImageController {
    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ImageResponseDTO>>> getImages() {
        return ResponseEntity.ok(ApiResponse.ok("Images retrieved successfully", imageService.getAllImages()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ImageResponseDTO>> getImageById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Images retrieved successfully", imageService.getImageById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ImageResponseDTO>> createImage(@Valid @RequestBody ImageRequestDTO image) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(ApiResponse.created("Image created successfully", imageService.createImage(image)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ImageResponseDTO>> updateImage(@PathVariable Long id,
                                                                     @Valid @RequestBody ImageRequestDTO image) {
        return ResponseEntity.ok(ApiResponse.ok("Image updated successfully", imageService.updateImage(id, image)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<ImageResponseDTO>> partialUpdateImage(@PathVariable Long id,
                                                                            @RequestBody ImageRequestDTO image) {
        return ResponseEntity.ok(ApiResponse.ok("Image updated successfully", imageService.partialUpdateImage(id, image)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteImage(@PathVariable Long id) {
        imageService.deleteImage(id);
        return ResponseEntity.ok(ApiResponse.noContent("Image deleted successfully"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteAllImage() {
        imageService.deleteAllImages();
        return ResponseEntity.ok(ApiResponse.noContent("Images deleted successfully"));
    }
}
