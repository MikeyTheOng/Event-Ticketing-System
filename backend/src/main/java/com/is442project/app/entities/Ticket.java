package com.is442project.app.entities;

import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Entity
@Table
public class Ticket {
    @Id
    @SequenceGenerator(name = "ticket_sequence", sequenceName = "ticket_sequence", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ticket_sequence")
    private Long ticketID;

    @Setter
    private Integer numGuest = 1;

    @ManyToOne
    @JsonIgnore
    private Booking booking;
    
    @Setter
    private boolean used = false;

    // Constructor
    public Ticket() {
    }

    public Ticket(Integer numGuest, Booking booking) {
        if (numGuest < 1 || numGuest > 4) {
            throw new IllegalArgumentException("Number of guests must be between 1 and 4");
        }

        this.numGuest = numGuest;
        this.booking = booking;
    }

    public String toString() {
        return "Ticket[" + "TicketID= " + ticketID + ", numGuest= " + numGuest + "]";
    }
}
