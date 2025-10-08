package com.kinganjia.backend.service;

import com.kinganjia.backend.model.Image;
import com.kinganjia.backend.repository.ImageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ImageService {
    private final ImageRepository imageRepository;

    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public Optional<Image> getImageById(Long id) {
        return imageRepository.findById(id);
    }

    public Image createImage(Image image) {
        return imageRepository.save(image);
    }

    public Image updateImage(Image image) {
        return imageRepository.save(image);
    }

    public List<Image> getAllImages() {
        return imageRepository.findAll();
    }

    public void deleteImageById(Long id) {
        imageRepository.deleteById(id);
    }

    public void deleteAllImages() {
        imageRepository.deleteAll();
    }
}
