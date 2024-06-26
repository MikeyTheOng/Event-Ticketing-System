package com.is442project.app.controllers;

import com.is442project.app.entities.Event;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;

@RestController
public class IndexController {

    @GetMapping("/")
    public String home(){
        return "hello";
    }

    
}

