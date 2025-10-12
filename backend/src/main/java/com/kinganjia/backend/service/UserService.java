package com.kinganjia.backend.service;

import com.kinganjia.backend.dto.UserRequestDTO;
import com.kinganjia.backend.dto.UserResponseDTO;
import com.kinganjia.backend.mapper.UserMapper;
import com.kinganjia.backend.model.User;
import com.kinganjia.backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(u -> userMapper.toResponse(u)).collect(Collectors.toList());
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return userMapper.toResponse(user);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public UserResponseDTO createUser(UserRequestDTO userDTO) {
        User user = userMapper.toEntity(userDTO);
        User createdUser = userRepository.save(user);
        return userMapper.toResponse(createdUser);
    }

    public UserResponseDTO updateUser(Long id, UserRequestDTO userDTO) {
        User existingUser = findUserById(id);
        userMapper.fullUpdateUserFromDto(userDTO, existingUser);
        log.info("User update : {}",existingUser);
        User updatedUser = userRepository.save(existingUser);
        return userMapper.toResponse(updatedUser);
    }

    public UserResponseDTO partialUpdateUser(Long id, UserRequestDTO userUpdate) {
        User existingUser = findUserById(id);
        userMapper.updateUserFromDto(userUpdate,existingUser);
        log.info("User partial update : {}",existingUser);
        User updatedUser = userRepository.save(existingUser);
        return userMapper.toResponse(updatedUser);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public void deleteAllUsers() {
        userRepository.deleteAll();
    }

    private User findUserById(Long id){
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}
