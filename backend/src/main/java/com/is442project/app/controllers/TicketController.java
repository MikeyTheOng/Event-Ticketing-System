package com.is442project.app.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.is442project.app.entities.Ticket;
import com.is442project.app.services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/ticket")
public class TicketController {
    private static final Logger logger = LoggerFactory.getLogger(TicketController.class);

    private final TicketService ticketService;

    @Autowired
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public List<Ticket> getTickets() {
        return ticketService.getTickets();
    }

    @PostMapping
    public ResponseEntity<String> CreateNewTicket(@RequestBody Ticket ticket) {
        if (ticket.getNumGuest() == null || ticket.getNumGuest() < 0 || ticket.getNumGuest() > 4) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Number of guests must be between 1 and 4 (inclusive).");
        }
        ticketService.addNewTicket(ticket);
        return ResponseEntity.status(HttpStatus.CREATED).body("Ticket created successfully.");
    }

    @DeleteMapping("/{ticketID}")
    public void deleteEvent(@PathVariable("ticketID") Long ticketID) {
        ticketService.deleteTicket(ticketID);
    }

    @GetMapping("/{ticketID}")
    public ResponseEntity<Object> verifyTicket(@PathVariable("ticketID") Long ticketID) {
        // Call a method from TicketService to check if the ticket with the given ID
        // exists
        try {
            logger.info("Verifying Ticket...");
            boolean ticketExists = ticketService.verifyTicketById(ticketID);

            if (!ticketExists) {
                Map<String, String> responseBody = new HashMap<String, String>();
                responseBody.put("status", "unverified");
                responseBody.put("message", "Ticket with ID " + ticketID + " does not exist.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseBody);
            }
            Ticket ticket = ticketService.getTicket(ticketID);
            if (ticket.isUsed()) {
                Map<String, String> responseBody = new HashMap<String, String>();
                responseBody.put("status", "unverified");
                responseBody.put("message", "Ticket with ID " + ticketID + " has already been used.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
            }
            ticket.setUsed(true);
            ticketService.updateTicket(ticket);

            Map<String, String> responseBody = new HashMap<String, String>();
            responseBody.put("status", "verified");
            responseBody.put("message", "Ticket with ID " + ticketID + " exists.");
            return ResponseEntity.status(HttpStatus.OK).body(responseBody);
        } catch (Exception e) {
            logger.info("Verifying Ticket error...");
            e.printStackTrace();
            Map<String, String> responseBody = new HashMap<String, String>();
            responseBody.put("status", "unverified");
            responseBody.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseBody);
        }
    }

    @DeleteMapping("/deleteAll")
    public void deleteAllTickets() {
        ticketService.deleteAll();
    }
}
