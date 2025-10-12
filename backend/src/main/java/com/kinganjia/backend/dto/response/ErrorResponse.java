package com.kinganjia.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Standard Error response wrapper for all exceptions
 */
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@SuperBuilder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse extends BaseResponse {
    private Map<String, String> errors;

    public ErrorResponse(boolean success, int status, String message, Map<String, String> errors, LocalDateTime timestamp) {
        super(success, status, message, timestamp);
        this.errors = errors;
    }

    public static ErrorResponse of(int status, String message) {
        return new ErrorResponse(false, status, message, null, LocalDateTime.now());
    }

    public static ErrorResponse validation(String message, Map<String, String> errors) {
        return new ErrorResponse(false, 400, message, errors, LocalDateTime.now());
    }
}