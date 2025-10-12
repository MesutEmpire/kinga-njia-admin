package com.kinganjia.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

/**
 * Standard API response wrapper for successful operations
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@SuperBuilder
public class ApiResponse<T> extends BaseResponse {
    private T data;

    public ApiResponse(boolean success, int status, String message, T data, LocalDateTime timestamp) {
        super(success, status, message, timestamp);
        this.data = data;
    }
    /**
     * Factory method for success responses
     */
    public static <T> ApiResponse<T> success(int status, String message, T data) {
        return new ApiResponse<>(true, status, message, data, LocalDateTime.now());
    }

    /**
     * Method for 200 OK responses
     */
    public static <T> ApiResponse<T> ok(String message, T data) {
        return success(200, message, data);
    }

    /**
     * Method for 201 Created responses
     */
    public static <T> ApiResponse<T> created(String message, T data) {
        return success(201, message, data);
    }

    /**
     * Method for 204 No Content
     */
    public static <T> ApiResponse<T> noContent(String message) {
        return success(204, message, null);
    }
}