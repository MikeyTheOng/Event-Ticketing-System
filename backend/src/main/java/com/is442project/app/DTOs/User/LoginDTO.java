package com.is442project.app.DTOs.User;

import lombok.Getter;
import lombok.Setter;

public class LoginDTO {

    @Getter
    @Setter
    private String email;

    @Getter
    @Setter
    private String password;

    public LoginDTO(
            String email,
            String password) {
        this.email = email;
        this.password = password;
    }
}
