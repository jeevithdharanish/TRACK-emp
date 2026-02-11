package com.dpx.tracker.dto.auth;

import com.dpx.tracker.dto.user.UserResponseDto;

public record AuthResponse(
        String token,
        UserResponseDto user
) {
}
