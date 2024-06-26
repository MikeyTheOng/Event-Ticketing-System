package com.is442project.app.security;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.is442project.app.entities.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

  public JWTAuthenticationFilter(AuthenticationManager authenticationManager) {
    super(authenticationManager);
  }

  @Override
  public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) {
    // Extract username and password from the request
    String username = obtainUsername(request);
    String password = obtainPassword(request);

    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username,
        password);
    return getAuthenticationManager().authenticate(authenticationToken);
  }

  @Override
  protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
      Authentication authResult) {
    User u = (User) authResult.getPrincipal();
    // Generate JWT token
    String token = Jwts.builder()
        .setSubject(u.getEmail())
        .setExpiration(new Date(System.currentTimeMillis() + Long.parseLong(System.getProperty("JWT_EXPIRATION_TIME"))))
        .signWith(SignatureAlgorithm.HS512, System.getProperty("JWT_SECRET_KEY"))
        .compact();
    response.addHeader("Authorization", "Bearer " + token);

    // Create a map or a simple POJO to hold the token
    Map<String, String> tokenMap = new HashMap<>();
    tokenMap.put("accessToken", token);
    tokenMap.put("tokenType", "Bearer");

    // Convert map to JSON string
    String jsonToken;
    try {
      jsonToken = new ObjectMapper().writeValueAsString(tokenMap);

      // Set content type and character encoding
      response.setContentType("application/json");
      response.setCharacterEncoding("UTF-8");

      // Write the JSON string to the response body
      response.getWriter().write(jsonToken);
      response.getWriter().flush();
    } catch (JsonProcessingException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    } finally {
      // just return with status code 500
      response.setStatus(500);
    }
  }
}
