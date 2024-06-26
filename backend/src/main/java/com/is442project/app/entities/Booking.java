package com.is442project.app.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table
public class Booking {
    @Id
    @SequenceGenerator(
            name = "booking_sequence",
            sequenceName = "booking_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "booking_sequence"
    )
    private Long bookingID;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @Setter
    private User booker;

    @OneToMany(cascade = CascadeType.PERSIST)
    @Setter
    private List<Ticket> ticketList;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @Setter
    private Event event;

    @Setter
    private boolean paymentStatus = true;

    @Setter
    private boolean cancellationStatus = false;

    @Transient
    private Double totalPrice;

    // Constructor
    public Booking() {
    }
    public Booking(Event event, List<Ticket> ticketList, User booker) {
        this.event = event;
        this.ticketList = (ticketList != null) ? ticketList : new ArrayList<>();
        this.booker = booker;
    }
    public Booking(Booking b){
        this.bookingID = b.getBookingID();
        this.booker = b.getBooker();
        this.ticketList = b.getTicketList();
        this.event = b.getEvent();
        this.paymentStatus = true;
        this.cancellationStatus = b.isCancellationStatus();
    }

    public void sendConfirmationEmail(){
    }

    public String toString(){
        return "Booking[" + "bookingID= " + bookingID + ", booker= " + booker.getName() +", ticketList= " + ticketList + ", event= " + event.getEventName() + ", paymentStatus= " + paymentStatus + ", cancellationStatus= " + cancellationStatus  +"]" ;
    }

    public double getTotalPrice(){
        int numTicket = 0;
        for(Ticket ticket : ticketList){
            numTicket += ticket.getNumGuest();
        }
        totalPrice = event.getPrice() * numTicket;
        return totalPrice;
    }
}
