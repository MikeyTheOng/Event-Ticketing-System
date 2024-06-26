package com.is442project.app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;

import org.hibernate.Session;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.is442project.app.DTOs.Booking.BookingRequestDTO;

// Import entities and services

import com.is442project.app.entities.*;
import com.is442project.app.services.*;
import com.is442project.mockData.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

@RestController
@RequestMapping("/mock")
public class MockController {
    private static final Logger logger = LoggerFactory.getLogger(MockController.class);

    @Autowired
    UserService userService;

    @Autowired
    EventService eventService;

    @Autowired
    BookingService bookingService;

    @Autowired
    TicketService ticketService;

    @PersistenceContext
    private EntityManager entityManager;


    @Transactional
    @DeleteMapping("/deleteAllUsersAndEvents")
    public ResponseEntity<?> deleteAllUsersAndE(){
        ExecutorService executor = Executors.newSingleThreadExecutor();

        // Perform tasks asynchronously within the thread
        executor.submit(() -> {
            try {
                // Perform database operations to delete records
                // * Reset User Table
                logger.info("Resetting users...");
                // Delete all users
                userService.deleteAll();

                // create test users
                User customer1 = new User("jordan@gmail.com", "Jordan", "12345", "Event Manager");
                User eventManager1 = new User("mike@gmail.com", "Mike", "12345");
                User ticketingOfficer1 = new User("TO@gmail.com", "Benjamin", "12345", "Ticketing Officer");
                userService.save(customer1);
                userService.save(eventManager1);
                userService.save(ticketingOfficer1);
                
                // * Reset Events Table
                logger.info("Resetting events...");
                // Delete all users
                eventService.deleteAll();
                // import from mockData
                eventService.addNewEvent(EventData.IUConcert);
                eventService.addNewEvent(EventData.BrunoMarsConcert);
                eventService.addNewEvent(EventData.TaylorSwiftConcert);
                eventService.addNewEvent(EventData.BTSConcert);
                eventService.addNewEvent(EventData.EdSheeranConcert);
                eventService.addNewEvent(EventData.AdeleConcert);
                eventService.addNewEvent(EventData.Maroon5Concert);
                eventService.addNewEvent(EventData.PinkConcert);
                eventService.addNewEvent(EventData.TrainConcert);
                eventService.addNewEvent(EventData.KeshiConcert);
                eventService.addNewEvent(EventData.JojiConcert);
                
                return ResponseEntity.ok().body("User and Event Tables have been reset.");

            } catch (Exception e) {
                // Handle exceptions
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to reset tables: " + e.getMessage());
            } finally {
                // Close the thread when operations are completed
                executor.shutdown();
            }

        });
        // Add a return statement here to satisfy the method return requirement
        return ResponseEntity.ok().body("Processing request...");
    }

    @Transactional
    @DeleteMapping("/deleteAllTicketsAndBookings")
    public ResponseEntity<?> deleteAllTicketsAndBookings(){
        try {
            // Perform database operations to delete records
            // * Reset Bookings & TicketsTable
            logger.info("Resetting Tickets & Bookings...");
            ticketService.deleteAll();
            bookingService.deleteAll();

            return ResponseEntity.ok().body("Booking and Ticket Tables have been cleared.");

        } catch (Exception e) {
            // Handle exceptions
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to reset tables: " + e.getMessage());
        } 
    }

    @GetMapping("/createTicketAndBookings")
    public ResponseEntity<?> createTicketAndBookingMockData(){
        try {
            // Perform database operations to delete records
            // * Add mock Bookings & Tickets
            logger.info("Adding mock Tickets & Bookings...");

            BookingRequestDTO br1 = new BookingRequestDTO(1L, new ArrayList<Integer>(){{ add(4); add(2); }}, "mike@gmail.com", "password");
            BookingRequestDTO br2 = new BookingRequestDTO(2L, new ArrayList<Integer>(){{ add(1); }}, "mike@gmail.com", "password");
            BookingRequestDTO br3 = new BookingRequestDTO(3L, new ArrayList<Integer>(){{ add(3); }}, "mike@gmail.com", "password");
            BookingRequestDTO br4 = new BookingRequestDTO(4L, new ArrayList<Integer>(){{ add(2); }}, "mike@gmail.com", "password");
            BookingRequestDTO br5 = new BookingRequestDTO(5L, new ArrayList<Integer>(){{ add(1); }}, "mike@gmail.com", "password");
            BookingRequestDTO br6 = new BookingRequestDTO(6L, new ArrayList<Integer>(){{ add(3); }}, "mike@gmail.com", "password");
            BookingRequestDTO br7 = new BookingRequestDTO(7L, new ArrayList<Integer>(){{ add(2); }}, "mike@gmail.com", "password");
            BookingRequestDTO br8 = new BookingRequestDTO(8L, new ArrayList<Integer>(){{ add(1); }}, "mike@gmail.com", "password");
            BookingRequestDTO br9 = new BookingRequestDTO(8L, new ArrayList<Integer>(){{ add(1); }}, "mike@gmail.com", "password");
            BookingRequestDTO br10 = new BookingRequestDTO(10L, new ArrayList<Integer>(){{ add(3); add(2); }}, "mike@gmail.com", "password");
            BookingRequestDTO br11 = new BookingRequestDTO(11L, new ArrayList<Integer>(){{ add(3); add(2); }}, "mike@gmail.com", "password");
            
            logger.info("Booking Request 1: " + br1.toString());
            
            bookingService.addNewBookingRequest( br1 );
            bookingService.addNewBookingRequest( br2 );
            bookingService.addNewBookingRequest( br3 );
            bookingService.addNewBookingRequest( br4 );
            bookingService.addNewBookingRequest( br5 );
            bookingService.addNewBookingRequest( br6 );
            bookingService.addNewBookingRequest( br7 );
            bookingService.addNewBookingRequest( br8 );
            bookingService.addNewBookingRequest( br9 );
            bookingService.addNewBookingRequest( br10 );
            bookingService.addNewBookingRequest( br11 );
            
            return ResponseEntity.ok().body("Mock Booking and Ticket data has been added.");

        } catch (Exception e) {
            // Handle exceptions
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to reset tables: " + e.getMessage());
        } 
    }
}
