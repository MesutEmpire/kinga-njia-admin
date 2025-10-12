package com.kinganjia.backend.mapper;

import com.kinganjia.backend.dto.UserRequestDTO;
import com.kinganjia.backend.dto.UserResponseDTO;
import com.kinganjia.backend.model.User;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponseDTO toResponse(User user);
    User toEntity(UserRequestDTO dto);

    // For partial updates - ignore null values
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUserFromDto(UserRequestDTO dto, @MappingTarget User user);

    // For full updates - update all values including nulls
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    void fullUpdateUserFromDto(UserRequestDTO dto, @MappingTarget User user);
}