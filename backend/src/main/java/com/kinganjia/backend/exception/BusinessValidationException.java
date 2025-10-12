package com.kinganjia.backend.exception;

/**
 * Thrown when business validation fails (400 Bad Request)
 */
public class BusinessValidationException extends RuntimeException {
    public BusinessValidationException(String message) {
        super(message);
    }
}