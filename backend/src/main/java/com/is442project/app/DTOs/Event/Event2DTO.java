package com.is442project.app.DTOs.Event;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

public class Event2DTO {
    @Getter
    @Setter
    private String eventName;
    
    @Getter
    @Setter
    private String venue;

    @Getter
    @Setter
    private LocalDateTime startTime;
    
    @Getter
    @Setter
    private Integer numTotalTickets;

    @Getter
    @Setter
    private Integer numTicketsAvailable;

    @Getter
    @Setter
    private Double price;

    @Getter
    @Setter 
    private Double cancellationFee = 0.0;

    @Getter
    @Setter
    private String thumbnail;

    // Constructor with all fields
    public Event2DTO(String eventName, String venue, LocalDateTime startTime, Integer numTotalTickets, Integer numTicketsAvailable, Double price, Double cancellationFee, String thumbnail) {
        this.eventName = eventName;
        this.venue = venue;
        this.startTime = startTime;
        this.numTotalTickets = numTotalTickets;
        this.numTicketsAvailable = numTicketsAvailable;
        this.price = price;
        this.cancellationFee = cancellationFee;
        this.thumbnail = thumbnail;
    }
}
