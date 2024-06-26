package com.is442project.app.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.is442project.app.services.UserAuthService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JWTUtils {

  @Value("${JWT_EXPIRATION_TIME}")
  private long expirationTime;

  @Autowired
  UserAuthService userAuthSerivce;

  public String generateToken(UserDetails user) {
    Map<String, Object> claims = new HashMap<>();
    // claims.put("role", user.getRole());
    claims.put("role", user.getAuthorities().stream().findFirst().orElse(null).getAuthority());
    return doGenerateToken(claims, user.getUsername());
  }

  private String doGenerateToken(Map<String, Object> claims, String subject) {
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(subject)
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + Long.parseLong(System.getProperty("JWT_EXPIRATION_TIME"))))
        .signWith(SignatureAlgorithm.HS512, System.getProperty("JWT_SECRET_KEY"))
        .compact();
  }
}
