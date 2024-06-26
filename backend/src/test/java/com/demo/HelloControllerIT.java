// ! HelloControllerIT uses TestRestTemplate to perform actual HTTP requests against the running server. It starts a real HTTP server and tests the controller in a more integrated manner. This approach is closer to an integration test
package com.demo;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootTest(classes = com.example.demo.DemoApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class HelloControllerIT {
    private static final Logger logger = LoggerFactory.getLogger(HelloControllerIT.class);
	@Autowired
	private TestRestTemplate template;

    @Test
    public void getHello() throws Exception {
        logger.trace("getHello: This is a TRACE log");
        logger.debug("getHello: This is a DEBUG log");
        logger.info("getHello: This is an INFO log");
        logger.error("getHello: This is an ERROR log");
        logger.info("getHello: Test started...");
        ResponseEntity<String> response = template.getForEntity("/", String.class);
        
        // Assert the response status code
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        
        // Assert the response body
        String expectedResponseBody = "Greetings from Spring Boot!";
        assertThat(response.getBody()).isEqualTo(expectedResponseBody);
        
        // Print the response JSON
        String jsonResponse = response.getBody();
        System.out.println("Response JSON: " + jsonResponse);
        logger.info("Test passed successfully!");
        System.out.println("GetHello: Test passed successfully!");
        
        // ResponseEntity<String> response = template.getForEntity("/", String.class);
        // assertThat(response.getBody()).isEqualTo("Greetings from Spring Boot!");
    }
}