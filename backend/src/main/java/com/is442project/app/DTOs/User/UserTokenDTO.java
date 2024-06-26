package com.is442project.app.DTOs.User;

import com.is442project.app.entities.User;

import lombok.Getter;
import lombok.Setter;

public class UserTokenDTO {

    @Getter
    @Setter
    private String email;

    @Getter
    @Setter
    private String name;

    @Getter
    @Setter
    private double bal;

    @Getter
    @Setter
    private String role;

    @Getter
    @Setter
    private String token;

    public UserTokenDTO(User user, String token) {
        this.email = user.getEmail();
        this.name = user.getName();
        this.bal = user.getBal();
        this.role = user.getRole();
        this.token = token;
    }
}
