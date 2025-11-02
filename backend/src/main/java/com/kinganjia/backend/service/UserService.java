package com.kinganjia.backend.service;

import com.kinganjia.backend.dto.UserRequestDTO;
import com.kinganjia.backend.dto.UserResponseDTO;
import com.kinganjia.backend.exception.DuplicateResourceException;
import com.kinganjia.backend.exception.ResourceNotFoundException;
import com.kinganjia.backend.mapper.UserMapper;
import com.kinganjia.backend.model.User;
import com.kinganjia.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                    .map(userMapper::toResponse)
                    .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        User user = findUserById(id);
        return userMapper.toResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                                  .orElseThrow(
                                          () -> new ResourceNotFoundException("User not found with email: " + email));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponseDTO createUser(UserRequestDTO userDTO) {
        if (userRepository.findByEmail(userDTO.getEmail())
                          .isPresent()) {
            throw new DuplicateResourceException("User with email " + userDTO.getEmail() + " already exists");
        }
        User user = userMapper.toEntity(userDTO);

        String rawPassword = userDTO.getPassword();
        String hashedPassword = passwordEncoder.encode(rawPassword);
        user.setPassword(hashedPassword);
        User createdUser = userRepository.save(user);
        return userMapper.toResponse(createdUser);
    }

    @Transactional
    public UserResponseDTO updateUser(Long id, UserRequestDTO userDTO) {
        User existingUser = findUserById(id);
        if (!existingUser.getEmail()
                         .equals(userDTO.getEmail()) && userRepository.findByEmail(userDTO.getEmail())
                                                                      .isPresent()) {
            throw new DuplicateResourceException("Email " + userDTO.getEmail() + " is already in use");
        }

        userMapper.fullUpdateUserFromDto(userDTO, existingUser);

        if (userDTO.getPassword() != null && !userDTO.getPassword()
                                                     .isEmpty()) {
            String hashedPassword = passwordEncoder.encode(userDTO.getPassword());
            existingUser.setPassword(hashedPassword);
        }

        User updatedUser = userRepository.save(existingUser);
        return userMapper.toResponse(updatedUser);
    }

    @Transactional
    public UserResponseDTO partialUpdateUser(Long id, UserRequestDTO userUpdate) {
        User existingUser = findUserById(id);

        if (userUpdate.getEmail() != null && !existingUser.getEmail()
                                                          .equals(userUpdate.getEmail()) && userRepository.findByEmail(
                                                                                                                  userUpdate.getEmail())
                                                                                                          .isPresent()) {
            throw new DuplicateResourceException("Email " + userUpdate.getEmail() + " is already in use");
        }

        userMapper.updateUserFromDto(userUpdate, existingUser);

        if (userUpdate.getPassword() != null && !userUpdate.getPassword()
                                                           .isEmpty()) {
            String hashedPassword = passwordEncoder.encode(userUpdate.getPassword());
            existingUser.setPassword(hashedPassword);
        }

        User updatedUser = userRepository.save(existingUser);
        return userMapper.toResponse(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllUsers() {
        userRepository.deleteAll();
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
                             .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
