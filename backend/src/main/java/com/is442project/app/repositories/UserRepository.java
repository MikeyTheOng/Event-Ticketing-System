package com.is442project.app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.is442project.app.entities.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
}