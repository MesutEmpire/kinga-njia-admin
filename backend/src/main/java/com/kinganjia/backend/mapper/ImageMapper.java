package com.kinganjia.backend.mapper;

import com.kinganjia.backend.dto.ImageResponseDTO;
import com.kinganjia.backend.model.Image;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ImageMapper {
    ImageMapper INSTANCE = Mappers.getMapper(ImageMapper.class);

    ImageResponseDTO toResponse(Image image);
    Image toEntity(Image image);
}
