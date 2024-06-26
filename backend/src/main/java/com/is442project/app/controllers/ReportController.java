package com.is442project.app.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.is442project.app.entities.Booking;
import com.is442project.app.entities.Event;
import com.is442project.app.entities.Report;
import com.is442project.app.entities.Ticket;
import com.is442project.app.entities.User;
import com.is442project.app.services.BookingService;
import com.is442project.app.services.EventService;
import com.is442project.app.services.ReportService;

@RestController
@RequestMapping("/report")
public class ReportController {

    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);
    private final ReportService reportService;

    private final EventService eventService;
    private final BookingService bookingService;

    @Autowired
    public ReportController(ReportService reportService, EventService eventService, BookingService bookingService) {
        this.reportService = reportService;
        this.eventService = eventService;
        this.bookingService = bookingService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('Event Manager')")
    public List<Report> getReports() {
        return reportService.getReports();
    }

    @GetMapping("/event/{eventID}")
    @PreAuthorize("hasAuthority('Event Manager')")
    public ResponseEntity<?> getEventReport(
            @PathVariable("eventID") Long eventID) {
        Event event = eventService.getEventById(eventID);
        if (event == null) {
            return ResponseEntity.badRequest().body("Event not found for ID: " + Long.toString(eventID));
        }

        Report report = new Report(event);
        List<Booking> bookings = bookingService.getBookingsByEventId(eventID);

        int attendees = 0;
        for (Booking booking : bookings) {
            for (Ticket ticket : booking.getTicketList()) {
                if (ticket.isUsed()) {
                    attendees += ticket.getNumGuest();
                }
            }
        }
        report.setNumAttended(attendees);
        report.setNumBookings(bookings.size());
        return ResponseEntity.ok(report);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('Event Manager')")
    public ResponseEntity<String> createNewReport(@RequestBody Report report) {

        Event event = eventService.getEventById(report.getEvent().getEventID());
        if (event == null) {
            return ResponseEntity.badRequest().body("Event not found for ID: " + report.getEvent().getEventID());
        }

        // Calculate numTicketsSold

        int numTicketsSold = event.getNumTotalTickets() - event.getNumTicketsAvailable();
        report.setNumTicketsSold(numTicketsSold);

        // Calculate revenue
        double revenue = numTicketsSold * event.getPrice();
        report.setRevenue(revenue);

        report.setNumAttended(numTicketsSold);

        reportService.addNewReport(report);
        return ResponseEntity.status(HttpStatus.CREATED).body("Report created successfully.");
    }

    @DeleteMapping("/{reportID}")
    @PreAuthorize("hasAuthority('Event Manager')")
    public void deleteEvent(@PathVariable("reportID") Long reportID) {
        reportService.deleteReport(reportID);
    }

    @DeleteMapping("/deleteAll")
    @PreAuthorize("hasAuthority('Event Manager')")
    public ResponseEntity<?> deleteAll() {
        logger.info("Deleting all events...");
        // Delete all reports
        reportService.deleteAll();
        return ResponseEntity.ok().body("All reports deleted");
    }

    @GetMapping("/event/{eventID}/export")
    @PreAuthorize("hasAuthority('Event Manager')")
    public ResponseEntity<?> getEventReportExport(
            @PathVariable("eventID") Long eventID) {
        // Assume getEventReport method returns a Report object for the given eventId
        Event event = eventService.getEventById(eventID);
        if (event == null) {
            return ResponseEntity.badRequest().body("Event not found for ID: " + Long.toString(eventID));
        }
        List<Booking> bookings = bookingService.getBookingsByEventId(eventID);
        StringBuilder csvContent = new StringBuilder(
                "BookingID,BookerEmail,EventID,NumTickets,Attendees,TotalPrice,PaymentStatus,CancellationStatus\n");

        for (Booking booking : bookings) {
            User booker = booking.getBooker();
            List<Ticket> tickets = booking.getTicketList();

            int attendees = 0;
            for (Ticket ticket : tickets) {
                if (ticket.isUsed()) {
                    attendees += ticket.getNumGuest();
                }
            }
            Double totalPrice = tickets.size() * event.getPrice();

            csvContent.append(String.join(",",
                    String.valueOf(booking.getBookingID()),
                    String.valueOf(booker.getEmail()),
                    String.valueOf(event.getEventID()),
                    String.valueOf(tickets.size()),
                    String.valueOf(attendees),
                    String.valueOf(totalPrice),
                    String.valueOf(booking.isPaymentStatus()),
                    String.valueOf(booking.isCancellationStatus()))).append("\n");
        }

        byte[] buf = csvContent.toString().getBytes();
        ByteArrayResource resource = new ByteArrayResource(buf);
        ;

        HttpHeaders header = new HttpHeaders();
        header.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report_" + eventID + ".csv");
        header.add(HttpHeaders.CONTENT_TYPE, "text/csv");

        return ResponseEntity.ok()
                .headers(header)
                .contentLength(buf.length)
                .body(resource);
    }

    @GetMapping("/export")
    @PreAuthorize("hasAuthority('Event Manager')")
    public ResponseEntity<?> exportToCSV() {
        List<Report> reports = reportService.getReports();
        StringBuilder csvContent = new StringBuilder();

        // Append CSV header
        csvContent.append(
                "ReportID,EventID,EventName,Venue,StartTime,NumTotalTickets,NumTicketsAvailable,Price,CancellationFee,Thumbnail,NumTicketsSold,Revenue,NumAttended\n");

        // Append report data
        for (Report report : reports) {
            csvContent.append(report.getReportID()).append(",")
                    .append(report.getEvent().getEventID()).append(",")
                    .append(report.getEvent().getEventName()).append(",")
                    .append(report.getEvent().getVenue()).append(",")
                    .append(report.getEvent().getStartTime()).append(",")
                    .append(report.getEvent().getNumTotalTickets()).append(",")
                    .append(report.getEvent().getNumTicketsAvailable()).append(",")
                    .append(report.getEvent().getPrice()).append(",")
                    .append(report.getEvent().getCancellationFee()).append(",")
                    .append(report.getEvent().getThumbnail()).append(",")
                    .append(report.getNumTicketsSold()).append(",")
                    .append(report.getRevenue()).append(",")
                    .append(report.getNumAttended()).append("\n");
        }

        byte[] buf = csvContent.toString().getBytes();
        ByteArrayResource resource = new ByteArrayResource(buf);

        HttpHeaders header = new HttpHeaders();
        header.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reports.csv");
        header.add(HttpHeaders.CONTENT_TYPE, "text/csv");

        return ResponseEntity.ok()
                .headers(header)
                .contentLength(buf.length)
                .body(resource);
    }

    @GetMapping("/dashboardStatistics")
    @PreAuthorize("hasAuthority('Event Manager')")
    public ResponseEntity<Object> getDashboardStatistics() {
        logger.info("Attemping to retrieve dashboard stats");
        try {
            Map<String, Integer> dashboardStats = reportService.getDashboardStatistics();
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "dashboard statistics retrieved");
            responseBody.put("stats", dashboardStats);

            System.out.println(responseBody);

            return ResponseEntity.ok().body(responseBody);
        } catch (Exception e) {
            logger.error("Failed to get dashboard stats" + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve balance: " + e.getMessage());
        }
    }
}