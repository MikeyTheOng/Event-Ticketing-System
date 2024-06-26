package com.is442project.app.services;

import com.is442project.app.controllers.TicketController;
import com.is442project.app.entities.Ticket;
import com.is442project.app.repositories.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    @Autowired
    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public List<Ticket> getTickets() {
        return ticketRepository.findAll();
    }

    public boolean verifyTicketById(Long ticketId) {
        // Check if the ticket with the given ID exists in the database
        return ticketRepository.existsById(ticketId);
    }

    public Ticket getTicket(Long ticketId) {
        return ticketRepository.getById(ticketId);
    }

    public void addNewTicket(Ticket ticket) {
        ticketRepository.save(ticket);
        System.out.println(ticket);
    }

    public Ticket updateTicket(Ticket ticket) {
        boolean exists = ticketRepository.existsById(ticket.getTicketID());
        if (!exists) {
            throw new IllegalStateException("ticket with id" + ticket.getTicketID() + "does not exists");
        }
        return ticketRepository.save(ticket);
    }

    public void deleteTicket(Long ticketID) {
        boolean exists = ticketRepository.existsById(ticketID);
        if (!exists) {
            throw new IllegalStateException("ticket with id" + ticketID + "does not exists");
        }
        ticketRepository.deleteById(ticketID);
    }

    public void deleteAll() {
        ticketRepository.deleteAll();
    }

}
