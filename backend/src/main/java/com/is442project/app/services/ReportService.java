package com.is442project.app.services;

import com.is442project.app.controllers.ReportController;
import com.is442project.app.entities.Report;
import com.is442project.app.repositories.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import com.is442project.app.entities.*;
import com.is442project.app.services.*;


import java.util.*;

@Service
public class ReportService {
    @Autowired
    EventService eventService;

    @Autowired
    BookingService bookingService;

    @Autowired
    TicketService ticketService;

    @Autowired
    private final ReportRepository reportRepository;

    public ReportService(ReportRepository reportRepository){
        this.reportRepository = reportRepository;
    }

    public List<Report> getReports() {
        return reportRepository.findAll();
    }

    public void addNewReport(Report report) {
        reportRepository.save(report);
        System.out.println(report);
    }
    public void deleteReport(Long reportID) {
        boolean exists = reportRepository.existsById(reportID);
        if(!exists){
            throw new IllegalStateException("report with id" + reportID + "does not exists");
        }
        reportRepository.deleteById(reportID);
    }
    public void deleteAll() {
        reportRepository.deleteAll();
    }

    public Map<String, Integer> getDashboardStatistics(){
        Map<String, Integer> dashboardStats = new HashMap<>();
        int numEvents = eventService.getEvents().size();
        int numBookings = bookingService.getBookings().size();
        int numTickets = ticketService.getTickets().size();

        dashboardStats.put("numEvents", numEvents);
        dashboardStats.put("numBookings", numBookings);
        dashboardStats.put("numTickets", numTickets);
        return dashboardStats;
    }
}


