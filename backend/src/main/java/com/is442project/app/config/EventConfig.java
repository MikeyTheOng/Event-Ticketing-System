package com.is442project.app.config;

import com.is442project.app.entities.Event;
import com.is442project.app.repositories.EventRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.*;

@Configuration
public class EventConfig {

    CommandLineRunner commandLineRunner(EventRepository repository) {
        return args -> {
            Event event1 = new Event(
                    "event1", "venue1", LocalDateTime.of(2024, Month.APRIL, 12, 12, 12), 500, 50.0, "");
            Event event2 = new Event(
                    "event2", "venue2", LocalDateTime.of(2024, Month.MAY, 10, 10, 10), 300, 60.0, "");

            repository.saveAll(List.of(event1, event1));
        };
    }
}
