package com.kinganjia.backend.mapper;

import com.kinganjia.backend.dto.ImageRequestDTO;
import com.kinganjia.backend.dto.ImageResponseDTO;
import com.kinganjia.backend.model.Image;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ImageMapper {
    ImageResponseDTO toResponse(Image image);
    Image toEntity(ImageRequestDTO dto);

    // For partial updates - ignore null values
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateImageFromDto(ImageRequestDTO dto, @MappingTarget Image image);

    // For full updates - update all values including nulls
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    void fullUpdateImageFromDto(ImageRequestDTO dto, @MappingTarget Image image);
}