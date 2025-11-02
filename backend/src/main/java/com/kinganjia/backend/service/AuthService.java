package com.kinganjia.backend.service;

import com.kinganjia.backend.dto.AuthResponseDTO;
import com.kinganjia.backend.dto.LoginRequestDTO;
import com.kinganjia.backend.dto.RegisterRequestDTO;
import com.kinganjia.backend.dto.UserResponseDTO;
import com.kinganjia.backend.exception.BusinessValidationException;
import com.kinganjia.backend.exception.DuplicateResourceException;
import com.kinganjia.backend.exception.ResourceNotFoundException;
import com.kinganjia.backend.mapper.UserMapper;
import com.kinganjia.backend.model.User;
import com.kinganjia.backend.repository.UserRepository;
import com.kinganjia.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail())
                          .isPresent()) {
            throw new DuplicateResourceException("User with email " + registerRequest.getEmail() + " already exists");
        }

        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getEmail());

        UserResponseDTO userResponse = userMapper.toResponse(savedUser);

        return new AuthResponseDTO(token, jwtUtil.getExpirationTime(), userResponse);
    }

    @Transactional(readOnly = true)
    public AuthResponseDTO login(LoginRequestDTO loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail())
                                  .orElseThrow(() -> {
                                      return new ResourceNotFoundException("Invalid email or password");
                                  });

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BusinessValidationException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        UserResponseDTO userResponse = userMapper.toResponse(user);

        return new AuthResponseDTO(token, jwtUtil.getExpirationTime(), userResponse);
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                                  .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.toResponse(user);
    }
}