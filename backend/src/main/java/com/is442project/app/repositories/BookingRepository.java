package com.is442project.app.repositories;
import com.is442project.app.entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long>{
    List<Booking> findAllByBookerEmail(String email);

    List<Booking> findByEvent_EventID(Long eventID);
}
