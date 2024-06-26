package com.is442project.app.services;

import com.is442project.app.controllers.EventController;
import com.is442project.app.entities.Event;
import com.is442project.app.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class EventService {

    private final EventRepository eventRepository;

    @Autowired
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getNewEvents() {
        List<Event> newEvents = eventRepository.findNewEvents(11L);
        // ArrayList<Event> newEvents = new ArrayList<>();
        // for (Event event : events) {
        //     if (event.getEventID() > 11) {
        //         newEvents.add(event);
        //     }
        // }
        return newEvents;
    }

    public List<Event> getEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventByID(@PathVariable Long eventID) {
        return eventRepository.findById(eventID);
    }

    public Event addNewEvent(Event event) {
        Event savedEvent = eventRepository.save(event);
        return savedEvent;
    }

    public void deleteEvent(Long eventID) {
        boolean exists = eventRepository.existsById(eventID);
        if (!exists) {
            throw new IllegalStateException("event with id" + eventID + "does not exists");
        }
        eventRepository.deleteById(eventID);
    }

    @Transactional
    public Event updateEvent(Long eventID, Event updatedEvent) {
        Event event = eventRepository.findById(eventID)
                .orElseThrow(() -> new IllegalStateException(
                        "event with id" + eventID + "does not exists"));
        if (updatedEvent.getEventName() != null) {
            event.setEventName(updatedEvent.getEventName());
        }
        if (updatedEvent.getVenue() != null) {
            event.setVenue(updatedEvent.getVenue());
        }
        if (updatedEvent.getStartTime() != null) {
            event.setStartTime(updatedEvent.getStartTime());
        }
        if (updatedEvent.getNumTotalTickets() != null) {
            event.setNumTotalTickets(updatedEvent.getNumTotalTickets());
        }
        if (updatedEvent.getNumTicketsAvailable() != null) {
            event.setNumTicketsAvailable(updatedEvent.getNumTicketsAvailable());
        }
        if (updatedEvent.getPrice() != null) {
            event.setPrice(updatedEvent.getPrice());
        }
        if (updatedEvent.getCancellationFee() != null) {
            event.setCancellationFee(updatedEvent.getCancellationFee());
        }
        return eventRepository.save(event);
    }

    public void deleteAll() {
        eventRepository.deleteAll();
    }

    public Event getEventById(Long eventID) {
        Optional<Event> eventOptional = eventRepository.findById(eventID);
        return eventOptional.orElse(null);
    }
}
