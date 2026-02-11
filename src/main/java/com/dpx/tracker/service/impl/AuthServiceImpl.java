package com.dpx.tracker.service.impl;

import com.dpx.tracker.config.JwtService;
import com.dpx.tracker.dto.auth.AuthResponse;
import com.dpx.tracker.dto.auth.LoginRequest;
import com.dpx.tracker.dto.auth.RegisterRequest;
import com.dpx.tracker.dto.user.UserCreateDto;
import com.dpx.tracker.dto.user.UserResponseDto;
import com.dpx.tracker.entity.Role;
import com.dpx.tracker.entity.User;
import com.dpx.tracker.mapper.UserMapper;
import com.dpx.tracker.repository.RoleRepository;
import com.dpx.tracker.repository.UserRepository;
import com.dpx.tracker.security.UserPrincipal;
import com.dpx.tracker.service.AuthService;
import com.dpx.tracker.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private static final String DEFAULT_ROLE = "ROLE_EMPLOYEE";

    private final UserService userService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthServiceImpl(UserService userService,
                           UserRepository userRepository,
                           RoleRepository roleRepository,
                           AuthenticationManager authenticationManager,
                           JwtService jwtService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        Set<UUID> roleIds = resolveRoleIds(request.roleIds());
        UserCreateDto createDto = UserCreateDto.builder()
                .email(request.email())
                .password(request.password())
                .roleId(roleIds)
                .build();

        UserResponseDto createdUser = userService.createUser(createDto);
        User persistedUser = userRepository.findByEmail(createdUser.email())
                .orElseThrow(() -> new EntityNotFoundException("User not found after registration"));
        String token = jwtService.generateToken(UserPrincipal.fromUser(persistedUser));
        return new AuthResponse(token, createdUser);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
                UserPrincipal principal = (UserPrincipal) authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
                ).getPrincipal();
            User user = userRepository.findByEmail(principal.getUsername())
                    .orElseThrow(() -> new EntityNotFoundException("User not found: " + principal.getUsername()));
            String token = jwtService.generateToken(principal);
                UserResponseDto responseDto = UserMapper.userResponseDto(user);
            return new AuthResponse(token, responseDto);
        } catch (AuthenticationException ex) {
            throw new IllegalArgumentException("Invalid credentials", ex);
        }
    }

    private Set<UUID> resolveRoleIds(Set<UUID> desiredRoles) {
        if (desiredRoles != null && !desiredRoles.isEmpty()) {
            return desiredRoles;
        }
        Role role = roleRepository.findByName(DEFAULT_ROLE)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(DEFAULT_ROLE);
                    newRole.setDescription("Default employee role");
                    return roleRepository.save(newRole);
                });
        return Set.of(role.getId());
    }

}
