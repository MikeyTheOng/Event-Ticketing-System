package com.is442project.app.DTOs.Booking;

import com.is442project.app.entities.Booking;

import java.time.LocalDateTime;
import java.util.*;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Booking2 extends Booking {
    @Setter
    private String bookingStatus;

    public Booking2(Booking b, String bookingStatus) {
        super(b);
        this.bookingStatus = bookingStatus;
    }

    public String toString(){
        return "Booking2[" + super.toString() + ", bookingStatus= " + bookingStatus + "]";
    }
}