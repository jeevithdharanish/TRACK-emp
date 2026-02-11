package com.dpx.tracker.service;

import com.dpx.tracker.dto.auth.AuthResponse;
import com.dpx.tracker.dto.auth.LoginRequest;
import com.dpx.tracker.dto.auth.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
