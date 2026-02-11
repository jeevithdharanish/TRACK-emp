package com.dpx.tracker.service.impl;

import com.dpx.tracker.dto.user.UserCreateDto;
import com.dpx.tracker.dto.user.UserResponseDto;
import com.dpx.tracker.entity.Role;
import com.dpx.tracker.entity.User;
import com.dpx.tracker.mapper.UserMapper;
import com.dpx.tracker.repository.RoleRepository;
import com.dpx.tracker.repository.UserRepository;
import com.dpx.tracker.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public UserResponseDto createUser(UserCreateDto userCreateDto) {
        userRepository.findByEmail(userCreateDto.email()).ifPresent(existing -> {
            throw new IllegalArgumentException("User already exists with email: " + userCreateDto.email());
        });

        Set<Role> roles = userCreateDto.roleId().stream()
                .map(roleId -> roleRepository.findById(roleId)
                        .orElseThrow(() -> new EntityNotFoundException("Role not found: " + roleId)))
                .collect(Collectors.toSet());

        User user = new User();
        user.setEmail(userCreateDto.email());
        user.setPassword(passwordEncoder.encode(userCreateDto.password()));
        user.setCreatedAt(LocalDate.now());
        user.setIsEmployed(false);
        user.setRoles(roles);

        User saved = userRepository.save(user);
        return UserMapper.userResponseDto(saved);
    }
}
