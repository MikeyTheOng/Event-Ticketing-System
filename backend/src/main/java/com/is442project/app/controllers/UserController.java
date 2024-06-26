package com.is442project.app.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.is442project.app.DTOs.ApiResponse;
import com.is442project.app.DTOs.User.LoginDTO;
import com.is442project.app.DTOs.User.SignupDTO;
import com.is442project.app.DTOs.User.UserTokenDTO;
import com.is442project.app.entities.User;
import com.is442project.app.services.UserService;
import com.is442project.app.util.Emailer;

@CrossOrigin
@RestController
@RequestMapping("/user")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    UserService service;

    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping
    public List<User> findAll() {
        logger.info("Retrieving all users...");
        return service.findAll();
    }

    /**
     * User registration and also issues a JWT for immediate use
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupDTO dto) {
        try {
            logger.info("Registering new user...");
            UserTokenDTO userToken = service.registerNewUser(dto);
            return ResponseEntity.ok(new ApiResponse<>(true, "Registration successful", userToken));
        } catch (IllegalStateException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Registration failed: " + e.getMessage(), null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>(false, "An unexpected error occurred: " + e.getMessage(), null));
        }

    }

    /**
     * User login, issues a JWT
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = service.generateJwtToken(authentication);
            org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) authentication
                    .getPrincipal();

            User user = service.getUser(principal.getUsername());

            return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", new UserTokenDTO(user, jwt)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Login failed: " + e.getMessage(), null));
        }
    }

    @GetMapping("/self")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getSelf() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            User user = service.getUser(username);
            return ResponseEntity.ok(new ApiResponse<>(true, "Retrieved user", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Login failed: " + e.getMessage(), null));
        }
    }

    // TODO: remove below

    @PostMapping("/create")
    public ResponseEntity<?> save(@RequestBody User user) {
        logger.info("Creating user...");
        logger.info(user.getName());
        User newUser = service.save(user);
        if (newUser != null) {
            Map<String, Object> responseBody = new HashMap<>() {
                {
                    put("message", "New user created successfully");
                    put("user", new HashMap<String, String>() {
                        {
                            put("email", newUser.getEmail());
                            put("name", newUser.getName());
                            put("role", newUser.getRole());
                        }
                    });
                }
            };
            return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create new user");
        }
    }

    @PostMapping("/create/ticketingOfficer")
    public ResponseEntity<?> createTicketingOfficer(@RequestBody User user) {
        // Call the createTicketingOfficer method in UserService
        User ticketingOfficer = service.createTicketingOfficer(user.getEmail(), user.getName(), user.getPassword());

        // Return appropriate response based on the result
        if (ticketingOfficer != null) {
            Map<String, Object> responseBody = new HashMap<>() {
                {
                    put("message", "Ticketing Officer created successfully");
                    put("user", new HashMap<String, String>() {
                        {
                            put("email", ticketingOfficer.getEmail());
                            put("name", ticketingOfficer.getName());
                            put("role", ticketingOfficer.getRole());
                        }
                    });
                }
            };
            return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create ticketing officer");
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody User user) {
        // return ResponseEntity.status(HttpStatus.CREATED).body(service.save(user));
        logger.info("User verification in progress...");
        try {
            User verifiedUser = service.verify(user);

            // Construct the response body
            Map<String, String> responseBody = new HashMap<String, String>();
            responseBody.put("status", "verified");
            responseBody.put("email", verifiedUser.getEmail());
            responseBody.put("name", verifiedUser.getName());
            responseBody.put("role", verifiedUser.getRole());

            return ResponseEntity.ok().body(responseBody);
        } catch (Exception e) {
            // Construct the response body
            logger.error("User verification failed: " + e.getMessage());
            Map<String, String> responseBody = new HashMap<String, String>();
            responseBody.put("status", "unverified");
            responseBody.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
        }
    }

    @GetMapping("/balance/{email}")
    public ResponseEntity<?> getWalletBalance(@PathVariable String email) {
        try {
            logger.info("Retrieving user with email " + email + "...");
            Optional<User> user = service.getWalletBalance(email);

            // Construct the response body
            Map<String, String> responseBody = new HashMap<String, String>();
            responseBody.put("message", "balance retrieved");
            responseBody.put("balance", String.valueOf(user.get().getBal()));
            return ResponseEntity.ok().body(responseBody);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve balance: " + e.getMessage());
        }
    }

    @PostMapping("/sendEmail")
    public ResponseEntity<?> sendEmail(@RequestParam String username, @RequestParam String subject, @RequestParam String content) {
        try {
            Optional<User> optionalUser = service.findById(username);
            if (optionalUser.isPresent()) {
                String userEmail = optionalUser.get().getEmail();
                Emailer.sendEmail(userEmail, subject, content);
                return ResponseEntity.ok().body("Email sent successfully to " + userEmail);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with username " + username + " not found.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email: " + e.getMessage());
        }

      

    }

    // @DeleteMapping("/deleteAll")
    // public ResponseEntity<?> deleteAll(){
    // logger.info("Deleting all users...");
    // // Delete all users
    // service.deleteAll();

    // // create test users
    // User customer1 = new User("jordan@gmail.com", "Jordan", "12345", "Event
    // Manager");
    // User eventManager1 = new User("mike@gmail.com", "Mike", "12345");
    // service.save(customer1);
    // service.save(eventManager1);
    // return ResponseEntity.ok().body("All users deleted and test users are
    // created");
    // }

    // @GetMapping("/{id}")
    // public Book findById(@PathVariable long id){
    // return service.findById(id);
    // }

    // @PostMapping
    // public ResponseEntity<?> save(@RequestBody Book book){
    // return ResponseEntity.status(HttpStatus.CREATED).body(service.save(book));
    // }

    // @PutMapping("/{id}")
    // public Book update(@PathVariable long id, @RequestBody Book book){
    // return service.update(id, book);
    // }

    // @DeleteMapping("/{id}")
    // public Book delete(@PathVariable long id){
    // return service.delete(id);
    // }
}
