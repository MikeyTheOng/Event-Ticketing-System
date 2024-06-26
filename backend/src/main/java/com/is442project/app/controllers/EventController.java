package com.is442project.app.controllers;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
import com.is442project.app.DTOs.Event.Event1DTO;
import com.is442project.app.DTOs.Event.Event2DTO;
import com.is442project.app.entities.Booking;
import com.is442project.app.entities.Event;
import com.is442project.app.services.BookingService;
import com.is442project.app.services.EventService;

@CrossOrigin
@RestController
@RequestMapping("/event")
public class EventController {

    private static final Logger logger = LoggerFactory.getLogger(EventController.class);
    private final EventService eventService;
    private final BookingService bookingService;
    private final BookingController bookingController;

    @Autowired
    public EventController(EventService eventService, BookingService bookingService,
            BookingController bookingController) {
        this.eventService = eventService;
        this.bookingService = bookingService;
        this.bookingController = bookingController;
    }

    @GetMapping
    public List<Event> getEvents() {
        return eventService.getEvents();
    }

    // For testing purposes
    @GetMapping("/special")
    @PreAuthorize("isAuthenticated()")
    public List<Event> getSpecialEvents() {
        return eventService.getEvents();
    }

    // For testing purposes
    @GetMapping("/special/manager")
    @PreAuthorize("hasAuthority('Event Manager')")
    public List<Event> getManagerEvents() {
        return eventService.getEvents();
    }

    @GetMapping("/newEvents")
    public List<Event> getNewEvents() {
        return eventService.getNewEvents();
    }

    @GetMapping("/{eventID}")
    public Optional<Event> getEventByID(@PathVariable Long eventID) {
        return eventService.getEventByID(eventID);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('Event Manager')")
    public ResponseEntity<?> CreateNewEvent(
            @RequestBody Event1DTO event1DTO) {
        try {
            // logger.info("CreateNewEvent..." + event1DTO.getEventName() + "..." +
            // event1DTO.getVenue() + "..." + event1DTO.getStartTime() + "..." +
            // event1DTO.getNumTotalTickets() + "..." + event1DTO.getPrice() + "..." +
            // event1DTO.getCancellationFee() + "..." + event1DTO.getThumbnail());
            Event newEvent = new Event(event1DTO.getEventName(), event1DTO.getVenue(), event1DTO.getStartTime(),
                    event1DTO.getNumTotalTickets(), event1DTO.getPrice(), event1DTO.getCancellationFee(),
                    event1DTO.getThumbnail());

            return ResponseEntity.ok(new ApiResponse<>(true, "Created Event", eventService.addNewEvent(newEvent)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Failed to created event: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{eventID}")
    @PreAuthorize("hasAuthority('Event Manager')")
    public void deleteEvent(@PathVariable("eventID") Long eventID) {
        eventService.deleteEvent(eventID);
    }

    @PutMapping("/{eventID}")
    @PreAuthorize("hasAuthority('Event Manager')")
    public Event updateEvent(
            @PathVariable("eventID") Long eventID,
            @RequestBody Event2DTO event2DTO) {

        Event updatedEvent = new Event(event2DTO.getEventName(), event2DTO.getVenue(), event2DTO.getStartTime(),
                event2DTO.getNumTotalTickets(), event2DTO.getNumTicketsAvailable(), event2DTO.getPrice(),
                event2DTO.getCancellationFee(), event2DTO.getThumbnail());
        logger.info("Updating event with ID: " + eventID);
        logger.info("Updating numTicketsAvailable to: " + updatedEvent.getNumTicketsAvailable() + "...");
        // return updatedEvent;
        return eventService.updateEvent(eventID, updatedEvent);
    }

    @PutMapping("/{eventID}/cancel")
    @PreAuthorize("hasAuthority('Event Manager')")
    public ResponseEntity<String> updateEventCancellationStatus(@PathVariable Long eventID) {
        Event existingEvent = eventService.getEventById(eventID);
        if (existingEvent == null) {
            return ResponseEntity.notFound().build();
        }
        if (existingEvent.getCancelled()) {
            return ResponseEntity.badRequest().body("Event has already been cancelled.");
        } else {
            List<Booking> bookingsToUpdate = bookingService.getBookingsByEventId(eventID);
            for (Booking booking : bookingsToUpdate) {
                // Invoke updateBookingCancellationStatus for each booking
                bookingController.updateBookingCancellationStatus(booking.getBookingID());
            }
            existingEvent.setCancelled(true);
            eventService.updateEvent(eventID, existingEvent);

            return ResponseEntity.ok("Event cancellation status updated successfully.");
        }
    }

    // @DeleteMapping("/deleteAll")
    // public ResponseEntity<?> deleteAll() {
    // logger.info("Deleting all events...");
    // // Delete all events
    // eventService.deleteAll();

    // // create test events
    // Event IUConcert = new Event("2024 IU H.E.R. WORLD TOUR CONCERT IN SINGAPORE",
    // "Singapore Indoor Stadium",
    // LocalDateTime.of(2024, Month.APRIL, 3, 20, 0), 10000, 100.0,
    // "https://static.ticketmaster.sg/images/activity/24sg_iu2024_ac516b9831976ec0b047eeaa54d4d86e.jpg");
    // Event BrunoMarsConcert = new Event("2024 BRUNO MARS WORLD TOUR CONCERT IN
    // SINGAPORE",
    // "Singapore Indoor Stadium", LocalDateTime.of(2024, Month.MAY, 2, 18, 30),
    // 10000, 100.0,
    // "https://static.ticketmaster.sg/images/activity/24sg_brunomars_536cf5435a2ec6760be8364b81d55c31.jpg");
    // Event TaylorSwiftConcert = new Event("2024 TAYLOR SWIFT WORLD TOUR CONCERT IN
    // SINGAPORE",
    // "Singapore Indoor Stadium", LocalDateTime.of(2024, Month.JUNE, 1, 19, 0),
    // 10000, 100.0,
    // "https://s1.ticketm.net/dam/a/a67/86eb84c0-ad6a-43c6-a55f-ff5d109c9a67_RETINA_PORTRAIT_3_2.jpg");
    // Event BTSConcert = new Event("2024 BTS WORLD TOUR CONCERT IN SINGAPORE",
    // "Singapore Indoor Stadium",
    // LocalDateTime.of(2024, Month.JULY, 1, 19, 0), 10000, 100.0,
    // "https://s1.ticketm.net/dam/a/987/77659b74-aaf7-4587-918d-f692669ac987_1619751_RETINA_PORTRAIT_3_2.jpg");
    // Event EdSheeranConcert = new Event("2024 ED SHEERAN WORLD TOUR CONCERT IN
    // SINGAPORE",
    // "Singapore Indoor Stadium", LocalDateTime.of(2024, Month.AUGUST, 1, 19, 0),
    // 10000, 100.0,
    // "https://s1.ticketm.net/dam/a/7d5/97b67038-f926-4676-be88-ebf94cb5c7d5_1802151_RETINA_PORTRAIT_3_2.jpg");
    // Event AdeleConcert = new Event("2024 ADELE WORLD TOUR CONCERT IN SINGAPORE",
    // "Singapore Indoor Stadium",
    // LocalDateTime.of(2024, Month.SEPTEMBER, 1, 19, 0), 10000, 100.0,
    // "https://prismic-images.tmol.io/ticketmaster-tm-global/31934e58-096e-48f1-b142-366be32d22b0_adele+about+new.png?auto=compress,format&rect=8,0,1422,1122&w=720&h=568");
    // Event Maroon5Concert = new Event("2024 MAROON 5 WORLD TOUR CONCERT IN
    // SINGAPORE", "Singapore Indoor Stadium",
    // LocalDateTime.of(2024, Month.OCTOBER, 1, 19, 0), 10000, 100.0,
    // "https://s1.ticketm.net/dam/a/68b/7a4f0617-2c6b-41d6-ab13-93dfeaf3d68b_RETINA_PORTRAIT_3_2.jpg");
    // Event PinkConcert = new Event("2024 P!NK WORLD TOUR CONCERT IN SINGAPORE",
    // "Singapore Indoor Stadium",
    // LocalDateTime.of(2024, Month.NOVEMBER, 1, 19, 0), 10000, 100.0,
    // "https://prismic-images.tmol.io/ticketmaster-tm-global/68dabf49-a729-405a-93d4-6eb0eed85f50_EADP-About-Image-PINK24.jpg?auto=compress,format&rect=8,0,1422,1122&w=720&h=568");
    // Event TrainConcert = new Event("2024 TRAIN WORLD TOUR CONCERT IN SINGAPORE",
    // "Singapore Indoor Stadium",
    // LocalDateTime.of(2024, Month.DECEMBER, 1, 19, 0), 10000, 100.0,
    // "https://prismic-images.tmol.io/ticketmaster-tm-global/95024411-bd41-47e6-8ef1-5afc52ba3924_EADP-About-Image-Train.jpg?auto=compress,format&rect=8,0,1422,1122&w=720&h=568");
    // Event KeshiConcert = new Event("2024 KESHI WORLD TOUR CONCERT IN SINGAPORE",
    // "Singapore Indoor Stadium",
    // LocalDateTime.of(2024, Month.DECEMBER, 1, 19, 0), 10000, 100.0,
    // "https://s1.ticketm.net/dam/a/7c7/3e65ddb9-849d-40c8-a081-ef9748d7c7c7_1820921_RETINA_PORTRAIT_3_2.jpg");
    // Event JojiConcert = new Event("2024 JOJI WORLD TOUR CONCERT IN SINGAPORE",
    // "Singapore Indoor Stadium",
    // LocalDateTime.of(2024, Month.DECEMBER, 1, 19, 0), 10000, 100.0,
    // "https://www.billboard.com/wp-content/uploads/2020/03/joji-2020-cr-Damien-Maloney-billboard-1548-1585678185.jpg?w=942&h=623&crop=1");

    // eventService.addNewEvent(IUConcert);
    // eventService.addNewEvent(BrunoMarsConcert);
    // eventService.addNewEvent(TaylorSwiftConcert);
    // eventService.addNewEvent(BTSConcert);
    // eventService.addNewEvent(EdSheeranConcert);
    // eventService.addNewEvent(AdeleConcert);
    // eventService.addNewEvent(Maroon5Concert);
    // eventService.addNewEvent(PinkConcert);
    // eventService.addNewEvent(TrainConcert);
    // eventService.addNewEvent(KeshiConcert);
    // eventService.addNewEvent(JojiConcert);

    // // eventService.addNewEvent();
    // return ResponseEntity.ok().body("All events deleted and test events are
    // created");
    // }
}
