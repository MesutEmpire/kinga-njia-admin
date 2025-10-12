package com.kinganjia.backend.mapper;

import com.kinganjia.backend.dto.ClaimRequestDTO;
import com.kinganjia.backend.model.Claim;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ClaimMapper {
    ClaimMapper INSTANCE = Mappers.getMapper(ClaimMapper.class);

    ClaimRequestDTO toResponse(Claim claim);
    Claim  toEntity(ClaimRequestDTO claimRequestDTO);
}
