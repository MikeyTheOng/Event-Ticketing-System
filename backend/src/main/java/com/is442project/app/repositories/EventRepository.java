package com.is442project.app.repositories;
import com.is442project.app.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long>{
    @Query("SELECT e FROM Event e WHERE e.eventID > :eventId ORDER BY e.eventID DESC")
    List<Event> findNewEvents(@Param("eventId") Long eventId);
}
