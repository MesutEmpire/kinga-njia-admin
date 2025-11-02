package com.kinganjia.backend.mapper;

import com.kinganjia.backend.dto.ClaimRequestDTO;
import com.kinganjia.backend.dto.ClaimResponseDTO;
import com.kinganjia.backend.dto.UserRequestDTO;
import com.kinganjia.backend.model.Claim;
import com.kinganjia.backend.model.User;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ClaimMapper {
    ClaimMapper INSTANCE = Mappers.getMapper(ClaimMapper.class);

    ClaimResponseDTO toResponse(Claim claim);

    @Mapping(target = "user", source = "userId", qualifiedByName = "mapUserIdToUser")
    Claim  toEntity(ClaimRequestDTO claimRequestDTO);

    // For partial updates - ignore null values
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateClaimFromDto(ClaimRequestDTO dto, @MappingTarget Claim claim);

    // For full updates - update all values including nulls
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    void fullUpdateClaimFromDto(ClaimRequestDTO dto, @MappingTarget Claim claim);

    @Named("mapUserIdToUser")
    default User mapUserIdToUser(Long userId) {
        if (userId == null) return null;
        User user = new User();
        user.setId(userId);
        return user;
    }
}
