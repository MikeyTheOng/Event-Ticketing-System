package com.is442project.app.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.is442project.app.services.UserAuthService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

public class JWTAuthorizationFilter extends BasicAuthenticationFilter {

  private final UserAuthService userAuthService;
  private final UserDetailsService userDetailsService;

  public JWTAuthorizationFilter(AuthenticationManager authenticationManager, UserDetailsService userDetailsService,
      UserAuthService userAuthService) {
    super(authenticationManager);

    this.userDetailsService = userDetailsService;
    this.userAuthService = userAuthService;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    String token = request.getHeader("Authorization");
    if (token != null && token.startsWith("Bearer ")) {
      UsernamePasswordAuthenticationToken authentication = getAuthentication(token);
      SecurityContextHolder.getContext().setAuthentication(authentication);
    }
    chain.doFilter(request, response);
  }

  private UsernamePasswordAuthenticationToken getAuthentication(String token) {
    // Parse the token and validate it
    Claims claims = Jwts.parser()
        .setSigningKey(System.getProperty("JWT_SECRET_KEY"))
        .parseClaimsJws(token.replace("Bearer ", ""))
        .getBody();

    String user = claims.getSubject();
    // String role = claims.get("role", String.class)

    if (user != null) {
      return new UsernamePasswordAuthenticationToken(user, null,
          userAuthService.loadUserByUsername(user).getAuthorities());
    }
    return null;
  }
}
