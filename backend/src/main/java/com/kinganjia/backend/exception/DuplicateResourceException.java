package com.kinganjia.backend.exception;

/**
 * Thrown when trying to create a duplicate resource (409 Conflict)
 */
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}