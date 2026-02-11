package com.dpx.tracker.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.Set;
import java.util.UUID;

public record RegisterRequest(
        @Email(message = "Email must be valid") String email,
        @NotBlank(message = "Password is required") String password,
        Set<UUID> roleIds
) {
}
