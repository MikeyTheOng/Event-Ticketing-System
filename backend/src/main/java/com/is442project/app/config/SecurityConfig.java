package com.is442project.app.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

import com.is442project.app.security.JWTAuthenticationFilter;
import com.is442project.app.security.JWTAuthorizationFilter;
import com.is442project.app.services.UserAuthService;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true) // Enables @PreAuthorize and @PostAuthorize annotations
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  @Autowired
  private UserDetailsService userDetailsService;

  @Autowired
  private UserAuthService userAuthService;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
        .csrf().disable() // CSRF is not needed for stateless authentication
        .sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // No session
        .and()
        .authorizeRequests()
        // Authenticated routes
        // Public auth routes
        .antMatchers(HttpMethod.POST, "/signup").permitAll()
        .antMatchers(HttpMethod.POST, "/login").permitAll()
        // Allow all other GET requests
        .antMatchers(HttpMethod.GET, "/**").permitAll()
        .and()
        .addFilter(new JWTAuthenticationFilter(authenticationManager()))
        .addFilter(new JWTAuthorizationFilter(authenticationManager(), userDetailsService, userAuthService));

    // Optional: Use custom authentication entry point to handle authentication
    // errors
    http.exceptionHandling()
        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED));
  }

  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.userDetailsService(userDetailsService);
  }

  @Bean
  @Override
  public AuthenticationManager authenticationManagerBean() throws Exception {
    return super.authenticationManagerBean();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    // return new BCryptPasswordEncoder();
    // NoOpPasswordEncoder performs no hashing
    return NoOpPasswordEncoder.getInstance();
  }
}