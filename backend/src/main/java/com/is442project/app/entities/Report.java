package com.is442project.app.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Entity
@Table
public class Report {
    @Id
    @SequenceGenerator(name = "report_sequence", sequenceName = "report_sequence", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "report_sequence")
    private Long reportID;

    @Setter
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @Setter
    private Integer numTicketsSold;

    @Setter
    private Double revenue;

    @Setter
    private Integer numAttended;

    @Setter
    private Integer numBookings;

    // Constructor
    public Report() {
    }

    public Report(Event event) {
        this.event = event;
        this.numTicketsSold = event.getNumTotalTickets() - event.getNumTicketsAvailable();
        this.revenue = this.numTicketsSold * event.getPrice();

        // Initialize numAttended to 0 initially
        this.numAttended = 0;
        this.numBookings = 0;

    }

    public String toString() {
        return "Report[" + "ReportID= " + reportID + ", numTicketsSold= " + numTicketsSold + ", revenue= " + revenue
                + ", numAttended= " + numAttended + "]";
    }
}
