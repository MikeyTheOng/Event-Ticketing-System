// ! HelloControllerTest uses MockMvc to simulate HTTP requests and test the controller without starting a real HTTP server. It's more focused on unit testing the controller logic in isolation.

package com.demo;

import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

// @SpringBootTest
@SpringBootTest(classes = com.example.demo.DemoApplication.class)
@AutoConfigureMockMvc
public class HelloControllerTest {

	@Autowired
	private MockMvc mvc;

	@Test
	public void getHello() throws Exception {
		System.out.println("Test started...");
		// Perform the GET request
		MvcResult result = mvc.perform(MockMvcRequestBuilders.get("/").accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().string(equalTo("Greetings from Spring Boot!")))
				.andReturn();
		// Get the response content and print it
		String jsonResponse = result.getResponse().getContentAsString();
		System.out.println("JSON response: " + jsonResponse);
		
		// Print a success message
		System.out.println("Test passed successfully!");
		// mvc.perform(MockMvcRequestBuilders.get("/").accept(MediaType.APPLICATION_JSON))
		// 		.andExpect(status().isOk())
		// 		.andExpect(content().string(equalTo("Greetings from Spring Boot!")));
	}
}