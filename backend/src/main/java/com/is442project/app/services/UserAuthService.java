package com.is442project.app.services;

import java.util.Collection;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.is442project.app.entities.User;
import com.is442project.app.repositories.UserRepository;

@Service
public class UserAuthService implements UserDetailsService {

  @Autowired
  private UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByEmail(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

    return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),
        getAuthorities(user));
  }

  private Collection<? extends GrantedAuthority> getAuthorities(User user) {
    // SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" +
    // user.getRole().toUpperCase());
    SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole());
    return Collections.singletonList(authority);
  }
}
