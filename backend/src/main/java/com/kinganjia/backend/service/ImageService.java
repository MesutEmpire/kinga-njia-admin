package com.kinganjia.backend.service;

import com.kinganjia.backend.dto.ClaimResponseDTO;
import com.kinganjia.backend.dto.ImageRequestDTO;
import com.kinganjia.backend.dto.ImageResponseDTO;
import com.kinganjia.backend.mapper.ImageMapper;
import com.kinganjia.backend.model.Claim;
import com.kinganjia.backend.model.Image;
import com.kinganjia.backend.repository.ImageRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ImageService {
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;

    public ImageService(ImageRepository imageRepository, ImageMapper imageMapper) {
        this.imageRepository = imageRepository;
        this.imageMapper = imageMapper;
    }

    public List<ImageResponseDTO> getAllImages() {
        List<Image> images = imageRepository.findAll();
        return images.stream().map(u -> imageMapper.toResponse(u)).collect(Collectors.toList());
    }

    public ImageResponseDTO getImageById(Long id) {
        Image image = imageRepository.findById(id).orElseThrow(() -> new RuntimeException("Image not found"));
        return imageMapper.toResponse(image);
    }

    public List<ImageResponseDTO> getClaimByClaimId(Long id) {
        List<Image> claims =imageRepository.findByClaimId(id).orElseThrow(() -> new RuntimeException("Image not found"));
        return claims.stream().map(u -> imageMapper.toResponse(u)).collect(Collectors.toList());
    }

    public ImageResponseDTO createImage(ImageRequestDTO imageDTO) {
        Image image = imageMapper.toEntity(imageDTO);
        Image createdImage = imageRepository.save(image);
        return imageMapper.toResponse(createdImage);
    }

    public ImageResponseDTO updateImage(Long id, ImageRequestDTO imageDTO) {
        Image existingImage = findImageById(id);
        imageMapper.fullUpdateImageFromDto(imageDTO, existingImage);
        log.info("Image update : {}",existingImage);
        Image updatedImage = imageRepository.save(existingImage);
        return imageMapper.toResponse(updatedImage);
    }

    public ImageResponseDTO partialUpdateImage(Long id, ImageRequestDTO imageUpdate) {
        Image existingImage = findImageById(id);
        imageMapper.updateImageFromDto(imageUpdate,existingImage);
        log.info("Image partial update : {}",existingImage);
        Image updatedImage = imageRepository.save(existingImage);
        return imageMapper.toResponse(updatedImage);
    }

    public void deleteImage(Long id) {
        imageRepository.deleteById(id);
    }

    public void deleteAllImages() {
        imageRepository.deleteAll();
    }

    private Image findImageById(Long id){
        return imageRepository.findById(id).orElseThrow(() -> new RuntimeException("Image not found with id: " + id));
    }
}
