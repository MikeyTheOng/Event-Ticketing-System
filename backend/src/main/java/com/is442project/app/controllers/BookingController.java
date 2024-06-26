package com.is442project.app.controllers;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import com.is442project.app.entities.Ticket;
import com.is442project.app.util.Emailer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.is442project.app.DTOs.ApiResponse;
import com.is442project.app.DTOs.Booking.Booking2;
import com.is442project.app.DTOs.Booking.BookingRequestDTO;
import com.is442project.app.entities.Booking;
import com.is442project.app.entities.Event;
import com.is442project.app.entities.User;
import com.is442project.app.services.BookingService;
import com.is442project.app.services.EventService;
import com.is442project.app.services.UserService;

@RestController
@RequestMapping("/booking")
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    private final BookingService bookingService;

    private final EventService eventService;

    private final UserService userService;

    @Autowired
    public BookingController(BookingService bookingService, EventService eventService, UserService userService) {
        this.bookingService = bookingService;
        this.eventService = eventService;
        this.userService = userService;
    }

    @GetMapping
    public List<Booking> getBookings() {
        return bookingService.getBookings();
    }

    @GetMapping("/self")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMyBookings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Map<String, List<Booking2>> result = bookingService.getBookingsByEmail(email);
        return ResponseEntity.ok(new ApiResponse<>(true, "Retrieved your bookings", result));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('Ticketing Officer')") // used by TO to issue e-tickets
    public ResponseEntity<String> createNewBooking(@RequestBody BookingRequestDTO bookingRequest) {
        try {
            logger.info("Creating booking...");
            // Check if event is valid
            Event event = eventService.getEventById(bookingRequest.getEventID());
            if (event == null) {
                return ResponseEntity.badRequest().body("Invalid event ID.");
            }
            // Check if tickets are available
            Integer numAvailTickets = event.getNumTicketsAvailable();
            List<Integer> numBookingTicketsList = bookingRequest.getTicketList();
            Integer numBookingTickets = 0;
            for (Integer tickets : numBookingTicketsList) {
                numBookingTickets += tickets;
            }
            if (numBookingTickets > numAvailTickets) {
                return ResponseEntity.badRequest().body("Insufficient tickets available for this event.");
            }
            // // Check if the booking is made within the allowed timeframe
            // LocalDateTime eventStartTime = event.getStartTime();
            // LocalDateTime now = LocalDateTime.now();
            // long daysUntilEventStart = ChronoUnit.DAYS.between(now, eventStartTime);
            // if (daysUntilEventStart > 180 || daysUntilEventStart < 1) {
            //     return ResponseEntity.badRequest().body("Booking must be made between 1 day and 6 months in advance.");
            // }

            numAvailTickets -= numBookingTickets;
            event.setNumTicketsAvailable(numAvailTickets);
            eventService.updateEvent(event.getEventID(), event);

            bookingService.addNewBookingRequest(bookingRequest);
            double totalCost = numBookingTickets * event.getPrice();
            Optional<User> user = userService.findById(bookingRequest.getBookerEmail());
            String userEmail = user.get().getEmail();
            String subject = "Booking Confirmation";
            String content = "Your booking has been successfully created. Event details:\n"
                    + "Event Name: " + event.getEventName() + "\n"
                    + "Event Date: " + event.getStartTime() + "\n"
                    + "Number of Tickets: " + numBookingTickets + "\n"
                    + "Total Cost: " + totalCost + "\n"
                    + "Thank you for booking with us!";
            Emailer.sendEmail(userEmail, subject, content);

            return ResponseEntity.status(HttpStatus.CREATED).body("Booking created successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create booking: " + e.getMessage());
        }
    }

    @CrossOrigin
    @PostMapping("/create")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> createBooking(@RequestBody BookingRequestDTO bookingRequest) {

        try {
            logger.info("Creating booking...");
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            // Check if event is valid
            Event event = eventService.getEventById(bookingRequest.getEventID());
            if (event == null) {
                return ResponseEntity.badRequest().body("Invalid event ID.");
            }

            if(event.getCancelled()){
                return ResponseEntity.badRequest().body("Event has been cancelled.");
            }
            // Check if tickets are available
            Integer numAvailTickets = event.getNumTicketsAvailable();
            List<Integer> numBookingTicketsList = bookingRequest.getTicketList();
            Integer numBookingTickets = 0;
            for (Integer tickets : numBookingTicketsList) {
                numBookingTickets += tickets;
            }
            if (numBookingTickets > numAvailTickets) {
                return ResponseEntity.badRequest().body("Insufficient tickets available for this event.");
            }

            // Check if the booking is made within the allowed timeframe
            LocalDateTime eventStartTime = event.getStartTime();
            LocalDateTime now = LocalDateTime.now();
            long daysUntilEventStart = ChronoUnit.DAYS.between(now, eventStartTime);
            if (daysUntilEventStart > 180 || daysUntilEventStart < 1) {
                return ResponseEntity.badRequest().body("Booking must be made between 1 day and 6 months in advance.");
            }

            // Password Verification
            Optional<User> user = userService.findById(bookingRequest.getBookerEmail());
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid user.");
            }
            String password = user.get().getPassword();
            if (!Objects.equals(password, bookingRequest.getBookerPW())) {
                return ResponseEntity.badRequest().body("Invalid password.");
            }
            // Check if user has enough balance
            boolean isTicketingOfficer = false;
            for (GrantedAuthority authority : authentication.getAuthorities()) {
                if (authority.getAuthority().equals("Ticketing Officer")) {
                    isTicketingOfficer = true;
                    break;
                }
            }
            double userBalance = user.get().getBal();
            double totalCost = numBookingTickets * event.getPrice();
            if (!isTicketingOfficer && totalCost > userBalance) {
                return ResponseEntity.badRequest().body("Insufficient balance.");
            }

            // Creating Booking
            bookingService.addNewBookingRequest(bookingRequest);
            numAvailTickets -= numBookingTickets;
            event.setNumTicketsAvailable(numAvailTickets);
            eventService.updateEvent(event.getEventID(), event);
            if (!isTicketingOfficer) {
                user.get().setBal(userBalance - totalCost);
                userService.updateUser(user.get());
            }
            // Send Email to user

            String userEmail = user.get().getEmail();
            String subject = "Booking Confirmation";
            String content = "Your booking has been successfully created. Event details:\n"
                    + "Event Name: " + event.getEventName() + "\n"
                    + "Event Date: " + event.getStartTime() + "\n"
                    + "Number of Tickets: " + numBookingTickets + "\n"
                    + "Total Cost: " + totalCost + "\n"
                    + "Thank you for booking with us!";
            Emailer.sendEmail(userEmail, subject, content);

            return ResponseEntity.status(HttpStatus.CREATED).body("Booking created successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create booking: " + e.getMessage());
        }
    }

    @PutMapping("/{bookingID}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> updateBookingCancellationStatus(@PathVariable Long bookingID) {
        logger.info("Cancelling booking with ID: " + bookingID);
        Booking existingBooking = bookingService.getBookingById(bookingID);

        if (existingBooking == null) {
            return ResponseEntity.notFound().build();
        }
        // Get the email of the currently authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

//        logger.info("null check");

        // Check if the authenticated user is the owner of the booking
        boolean isEventManager = false;
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if (authority.getAuthority().equals("Event Manager")) {
                isEventManager = true;
                break;
            }
        }
        if (!existingBooking.getBooker().getEmail().equals(userEmail) && !isEventManager) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to cancel this booking.");
        }
//        logger.info("auth check");

        Event event = existingBooking.getEvent();

        LocalDateTime eventStartTime = event.getStartTime();
        LocalDateTime now = LocalDateTime.now();
        long hoursUntilEventStart = ChronoUnit.HOURS.between(now, eventStartTime);

        if (hoursUntilEventStart <= 48) {
            return ResponseEntity.badRequest()
                    .body("Booking cannot be cancelled within 48 hours of the event start time.");
        }
//        logger.info("hours check");

        if (existingBooking.isCancellationStatus()) {
            return ResponseEntity.badRequest().body("Booking has already been cancelled.");
        }
//        logger.info("book cancel check");

        // Update the number of available tickets for the event
        List<Ticket> numBookingTicketsList = existingBooking.getTicketList();
        Integer numBookedTickets = 0;
        for (Ticket tickets : numBookingTicketsList) {
            numBookedTickets += tickets.getNumGuest();
        }
        int numAvailTickets = event.getNumTicketsAvailable();
        event.setNumTicketsAvailable(numAvailTickets + numBookedTickets);
        eventService.updateEvent(event.getEventID(), event);

        existingBooking.setCancellationStatus(true);
        double totalPrice = existingBooking.getTotalPrice();
        if (!event.getCancelled() && !isEventManager) {
            totalPrice = totalPrice - event.getCancellationFee();
        }
        User booker = existingBooking.getBooker();
        booker.setBal(booker.getBal() + totalPrice); // Add total price to balance
        bookingService.updateBooking(bookingID, existingBooking);
//        logger.info("end check");
        return ResponseEntity.ok("Booking cancellation status updated successfully. Refund processed.");

    }

    @DeleteMapping("/{bookingID}")
    @PreAuthorize("isAuthenticated()")
    public void deleteBooking(@PathVariable("bookingID") Long bookingID) {
        bookingService.deleteBooking(bookingID);
    }

}
