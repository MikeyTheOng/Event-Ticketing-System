package com.is442project.app.DTOs.Booking;

import java.time.LocalDateTime;
import java.util.*;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class BookingRequestDTO {
    private Long eventID;
    
    private List<Integer> ticketList; // {4, 5, 4} each number represents the no. of guests for a ticket

    private String bookerEmail;

    private String bookerPW;

    // Constructor with all fields
    public BookingRequestDTO(Long eventID, List<Integer> ticketList, String bookerEmail, String bookerPW) {
        this.eventID = eventID;
        this.ticketList = ticketList;
        this.bookerEmail = bookerEmail;
        this.bookerPW = bookerPW;
    }

    public String toString(){
        return "BookingRequestDTO[" + "eventID= " + eventID + ", ticketList= " + ticketList + ", bookerEmail= " + bookerEmail + "]";
    }
}
