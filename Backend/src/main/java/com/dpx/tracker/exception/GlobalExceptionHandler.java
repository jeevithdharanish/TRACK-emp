package com.dpx.tracker.exception;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ErrorResponse> handleBaseException(BaseException e, HttpServletRequest request) {
        ErrorResponse response = new ErrorResponse(
                e.getErrorCode(),
                e.getMessage(),
                e.getStatus().value(),
                Instant.now(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(response, e.getStatus());
    }

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e, HttpServletRequest request) {
        ErrorResponse response = new ErrorResponse(
                "BAD_REQUEST",
                e.getMessage(),
                400,
                Instant.now(),
                request.getRequestURI()
        );
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler({jakarta.persistence.EntityNotFoundException.class})
    public ResponseEntity<ErrorResponse> handleEntityNotFound(jakarta.persistence.EntityNotFoundException e, HttpServletRequest request) {
        ErrorResponse response = new ErrorResponse(
                "NOT_FOUND",
                e.getMessage(),
                404,
                Instant.now(),
                request.getRequestURI()
        );
        return ResponseEntity.status(404).body(response);
    }

}
