package com.is442project.app.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Entity
@Table
public class Event {
    // Getter method for eventID
    @Id
    @SequenceGenerator(
            name = "event_sequence",
            sequenceName = "event_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "event_sequence"
    )
    private Long eventID;
    // Getter method for eventName
    @Setter
    private String eventName;
    // Getter method for venue
    @Setter
    private String venue;
    // Getter method for startTime
    @Setter
    private LocalDateTime startTime;
    @Setter
    private Integer numTotalTickets;
    // Getter method for numTicketsAvailable
    @Setter
    private Integer numTicketsAvailable;
    // Getter method for price
    @Setter
    private Double price;
    // Getter method for cancellationFee
    @Setter 
    private Double cancellationFee = 0.0;

    @Setter
    private String thumbnail;

    @Setter
    private Boolean cancelled = false;

    // Constructor
    public Event() {
        // Initialize any default values here
        // System.out.println("Default constructor called");
        this.eventName = "";
        this.venue = "";
        this.startTime = LocalDateTime.now();
        this.numTotalTickets = 0;
        this.numTicketsAvailable = 0;
        this.price = 0.0;
        this.eventID = 0L;
        this.cancellationFee = 0.0;
        this.thumbnail = "";
    }

    public Event(String eventName, String venue, LocalDateTime startTime, Integer numTotalTickets, Double price, String thumbnail) {
        this.eventName = eventName;
        this.venue = venue;
        this.startTime = startTime;
        this.numTotalTickets = numTotalTickets;
        this.numTicketsAvailable = numTotalTickets;
        this.price = price;
        this.thumbnail = thumbnail;
    }

    public Event(long eventID, String eventName, String venue, LocalDateTime startTime, Integer numTotalTickets, Double price, String thumbnail) {
        this.eventID = eventID;
        this.eventName = eventName;
        this.venue = venue;
        this.startTime = startTime;
        this.numTotalTickets = numTotalTickets;
        this.numTicketsAvailable = numTotalTickets;
        this.price = price;
        this.thumbnail = thumbnail;
    }

    public Event(String eventName, String venue, LocalDateTime startTime, Integer numTotalTickets, Double price, Double cancellationFee, String thumbnail) {
        // System.out.println("3rd event constructor called");
        this.eventName = eventName;
        this.venue = venue;
        this.startTime = startTime;
        this.numTotalTickets = numTotalTickets;
        this.numTicketsAvailable = numTotalTickets;
        this.price = price;
        this.cancellationFee = cancellationFee;
        this.thumbnail = thumbnail;
    }

    public Event(String eventName, String venue, LocalDateTime startTime, Integer numTotalTickets, Integer numTicketsAvailable, Double price, Double cancellationFee , String thumbnail) {
        // System.out.println("3rd event constructor called");
        this.eventName = eventName; 
        this.venue = venue;
        this.startTime = startTime;
        this.numTotalTickets = numTotalTickets;
        this.numTicketsAvailable = numTicketsAvailable;
        this.price = price;
        this.cancellationFee = cancellationFee;
        this.thumbnail = thumbnail;
    }

    public void refundAllBookings() {
    }

    public String toString() {
        return "Event[" + "eventName=" + eventName + ", venue=" + venue + ", startTime=" + startTime + ", numTotalTickets=" +
                numTotalTickets + ", numTicketsAvailable=" + numTicketsAvailable + ", price=" + price + ", eventID=" + eventID + ", thumbnail=" + thumbnail + ", cancelled=" + cancelled + "]";

    }

}
