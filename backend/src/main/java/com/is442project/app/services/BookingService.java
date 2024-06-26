package com.is442project.app.services;

import com.is442project.app.DTOs.Booking.*;
import com.is442project.app.controllers.BookingController;
import com.is442project.app.entities.*;
import com.is442project.app.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.*;

@Service
public class BookingService {
    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Autowired
    public BookingService(BookingRepository bookingRepository, EventRepository eventRepository,
            UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    public List<Booking> getBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        // Filter out bookings with deleted events
        bookings.removeIf(booking -> booking.getEvent() == null);
        return bookings;
    }

    // @Transactional
    public void addNewBooking(Booking booking) {
        Long eventId = booking.getEvent().getEventID();
        Event existingEvent = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalStateException("Event with ID " + eventId + " not found"));

        // Associate the fetched Event with the Booking
        booking.setEvent(existingEvent);
        String userEmail = booking.getBooker().getEmail();
        User existingUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User with email " + userEmail + " not found"));

        // Associate the fetched User with the Booking
        booking.setBooker(existingUser);

        bookingRepository.save(booking);
        System.out.println(booking);
    }

    public void addNewBookingRequest(BookingRequestDTO bookingRequest) {
        logger.info("Create Booking Object");
        Booking newBooking = new Booking();
        Long eventId = bookingRequest.getEventID();
        Event existingEvent = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalStateException("Event with ID " + eventId + " not found"));
        newBooking.setEvent(existingEvent); // * 1. Associate the fetched Event with the Booking

        logger.info("Retrieve User Object");
        String userEmail = bookingRequest.getBookerEmail();
        User existingUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalStateException("User with email " + userEmail + " not found"));
        newBooking.setBooker(existingUser); // * 2. Associate the fetched User with the Booking

        logger.info("Booking Object: " + newBooking.toString());
        logger.info("Create Tickets");
        List<Ticket> createdTickets = new ArrayList<>();
        List<Integer> ticketList = bookingRequest.getTicketList();
        logger.info("Ticket List: " + ticketList.toString());
        logger.info("Ticket List: " + ticketList.get(0));
        for (int guestsForEachTicket : ticketList) {
            createdTickets.add(new Ticket(guestsForEachTicket, newBooking));
        }

        newBooking.setTicketList(createdTickets); // * 3. Associate the created Tickets with the Booking
        newBooking.setPaymentStatus(true);
        newBooking.setCancellationStatus(false);
        logger.info("Booking Object: " + newBooking.toString());
        bookingRepository.save(newBooking);
    }

    public void save(Booking b) {
        bookingRepository.save(b);
    }

    public void deleteBooking(Long bookingID) {
        boolean exists = bookingRepository.existsById(bookingID);
        if (!exists) {
            throw new IllegalStateException("booking with id" + bookingID + "does not exists");
        }
        bookingRepository.deleteById(bookingID);
    }

    public void deleteAll() {
        bookingRepository.deleteAll();
    }

    public Booking getBookingById(Long bookingID) {
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingID);
        return bookingOptional.orElse(null);
    }

    public List<Booking> getBookingsByEventId(Long eventId) {
        return bookingRepository.findByEvent_EventID(eventId);
    }

    public static int compareBooking(Booking2 b1, Booking2 b2) {
        // compare by eventStartTime and bookingID
        int eventStartTimeComparison = b2.getEvent().getStartTime().compareTo(b1.getEvent().getStartTime());
        if (eventStartTimeComparison != 0) {
            return eventStartTimeComparison;
        }
        return b2.getBookingID().compareTo(b1.getBookingID());
    }

    public static boolean isCancelledBooking(Booking booking) {
        boolean isEventCancelled = booking.getEvent().getCancelled();
        boolean isBookingCancelled = booking.isCancellationStatus();
        if (isEventCancelled || isBookingCancelled) {
            return true;
        } else {
            return false;
        }
    }

    public static boolean isActiveBooking(Booking booking) {
        LocalDateTime todayDateTime = LocalDateTime.now();
        LocalDateTime eventStartDateTime = booking.getEvent().getStartTime();
        if (todayDateTime.isBefore(eventStartDateTime)) {
            return true;
        } else {
            return false;
        }
    }

    public Map<String, List<Booking2>> getBookingsByEmail(String email) {
        List<Booking> bookingsList = bookingRepository.findAllByBookerEmail(email);
        List<Booking2> activeBookingsList = new ArrayList<>();
        List<Booking2> bookingHistoryList = new ArrayList<>();
        for (Booking b : bookingsList) {
            User userModified = new User(b.getBooker().getEmail(), b.getBooker().getName());
            b.setBooker(userModified);
            logger.info("Booker: " + userModified.toString());
            if (isCancelledBooking(b)) {
                bookingHistoryList.add(new Booking2(b, "Cancelled"));
            } else if (isActiveBooking(b)) {
                activeBookingsList.add(new Booking2(b, "Active"));
            } else {
                bookingHistoryList.add(new Booking2(b, "Passed"));
            }
        }

        Map<String, List<Booking2>> bookingsMap = new HashMap<>();
        // activeBookingsList
        activeBookingsList.sort(BookingService::compareBooking);
        bookingsMap.put("upcomingBookings", activeBookingsList);
        bookingHistoryList.sort(BookingService::compareBooking);
        bookingsMap.put("bookingHistory", bookingHistoryList);
        return bookingsMap;
    }

    @Transactional
    public void updateBooking(Long bookingID, Booking updatedBooking) {
        Booking booking = bookingRepository.findById(bookingID)
                .orElseThrow(() -> new IllegalStateException(
                        "Booking with ID " + bookingID + " does not exist"));

        if (updatedBooking.getBooker() != null) {
            booking.setBooker(updatedBooking.getBooker());
        }
        if (updatedBooking.getTicketList() != null) {
            booking.setTicketList(updatedBooking.getTicketList());
        }
        if (updatedBooking.getEvent() != null) {
            booking.setEvent(updatedBooking.getEvent());
        }

        booking.setPaymentStatus(updatedBooking.isPaymentStatus());
        booking.setCancellationStatus(updatedBooking.isCancellationStatus());

        bookingRepository.save(booking);
    }
}
