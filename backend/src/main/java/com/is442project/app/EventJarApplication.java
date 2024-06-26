package com.is442project.app;

import io.github.cdimascio.dotenv.Dotenv;
import com.is442project.app.entities.Event;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.*;

@SpringBootApplication
@RestController
public class EventJarApplication {

	static {
		Dotenv dotenv = Dotenv.load();
		System.setProperty("JWT_SECRET_KEY", dotenv.get("JWT_SECRET_KEY"));
		System.setProperty("JWT_EXPIRATION_TIME", dotenv.get("JWT_EXPIRATION_TIME"));

	}

	public static void main(String[] args) {
		SpringApplication.run(EventJarApplication.class, args);
	}

}
