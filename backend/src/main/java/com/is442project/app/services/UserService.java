package com.is442project.app.services;

// import com.is442project.app.exceptions.NotFoundException;
// import net.bytebuddy.asm.Advice.OffsetMapping.Factory.Illegal;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.HelloController;
import com.is442project.app.DTOs.User.SignupDTO;
import com.is442project.app.DTOs.User.UserTokenDTO;
import com.is442project.app.entities.User;
import com.is442project.app.repositories.UserRepository;
import com.is442project.app.security.JWTUtils;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(HelloController.class);

    @Autowired
    UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtils jwtUtils;

    public List<User> findAll() {
        return repository.findAll();
    }

    public UserTokenDTO registerNewUser(SignupDTO dto) {
        logger.info("Email: "+dto.getEmail()+" Name: "+dto.getName()+" Password: "+dto.getPassword());
        if (dto.getEmail() == null || dto.getEmail().isEmpty() || 
        dto.getName() == null || dto.getName().isEmpty() || 
        dto.getPassword() == null || dto.getPassword().isEmpty()) {
            throw new IllegalStateException("All fields must be filled");
        } else if (repository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already in use");
        } else {
            logger.info("Creating user...");
            // Disable password encoding for now
            // User newUser = new User(dto.getEmail(), dto.getName(),
            // passwordEncoder.encode(dto.getPassword()));
            User newUser = new User(dto.getEmail(), dto.getName(), dto.getPassword());
    
            // default role
            newUser.setRole("Customer");
    
            repository.save(newUser);
    
            // Generate token after saving the user
            org.springframework.security.core.userdetails.User userDetails = new org.springframework.security.core.userdetails.User(
                    newUser.getEmail(), newUser.getPassword(), AuthorityUtils.createAuthorityList(newUser.getRole()));
            String token = jwtUtils.generateToken(userDetails);
    
            return new UserTokenDTO(newUser, token);
        }
        
    }

    public String generateJwtToken(Authentication authentication) {
        org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) authentication
                .getPrincipal();
        return jwtUtils.generateToken(principal);
    }

    public User getUser(String email) {
        return repository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public User save(User user) {
        try {
            if (user != null) {
                return repository.save(user);
            } else {
                // Handle the case where the user object is null
                // For example: throw IllegalArgumentException or log a warning
                throw new IllegalArgumentException("User object is null");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public User createTicketingOfficer(String email, String name, String password) {
        // Create a new user entity for ticketing officer
        try{
            if (email == null || name == null || password == null) {
                throw new IllegalStateException("All fields must be filled");
            }
            User ticketingOfficer = new User(email, name, password);
            ticketingOfficer.setRole("Ticketing Officer");
    
            // Save the ticketing officer using the save method
            return save(ticketingOfficer);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    } 

    public User verify(User user) throws IllegalArgumentException {
        if (user != null && user.getEmail() != null) {
            User userFromDb = repository.findById(user.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("Email is incorrect"));

            if (userFromDb.getPassword().equals(user.getPassword())) {
                return userFromDb;
            } else {
                throw new IllegalArgumentException("Password is incorrect");
            }
        } else {
            // Handle the case where the user object is null
            // For example: throw IllegalArgumentException or log a warning
            throw new IllegalArgumentException("User object is null");
        }
    }

    public void deleteAll() {
        repository.deleteAll();
    }

    public Optional<User> findById(String email) {
        return repository.findById(email);
    }

    public Optional<User> getWalletBalance(String username) throws Exception {
        // Retrieve the user from the database based on the username
        try {
            Optional<User> user = repository.findById(username);
            return user;
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception(e.getMessage());
        }
    }

    public User updateUser(User updatedUser) {
        // Check if the user exists in the database
        Optional<User> optionalUser = repository.findById(updatedUser.getEmail());
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();
            // Update the user details
            existingUser.setName(updatedUser.getName());
            existingUser.setPassword(updatedUser.getPassword());
            // Save the updated user
            return repository.save(existingUser);
        } else {
            // Handle the case where the user does not exist
            throw new IllegalArgumentException("User with email " + updatedUser.getEmail() + " not found");
        }
    }
    // public Book save(Book book){
    // Author author = authorService.findById(book.getAuthorId());
    // book.setAuthor(author);
    // return repository.save(book);
    // }

    // public Book update(long id, Book book){
    // Book bookFromDb = findById(id);
    // Author author = authorService.findById(book.getAuthorId());
    // book.setId(bookFromDb.getId());
    // book.setCreatedAt(bookFromDb.getCreatedAt());
    // book.setAuthor(author);
    // return repository.save(book);
    // }

    // public Book delete(long id){
    // Book book = findById(id);
    // repository.delete(book);
    // return book;
    // }
}
