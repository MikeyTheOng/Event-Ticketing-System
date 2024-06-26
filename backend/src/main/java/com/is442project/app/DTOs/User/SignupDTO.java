package com.is442project.app.DTOs.User;

import lombok.Getter;
import lombok.Setter;

public class SignupDTO {

    @Getter
    @Setter
    private String email;

    @Getter
    @Setter
    private String password;

    @Getter
    @Setter
    private String name;

    public SignupDTO(
            String email,
            String password,
            String name) {
        this.email = email;
        this.password = password;
        this.name = name;
    }

}
