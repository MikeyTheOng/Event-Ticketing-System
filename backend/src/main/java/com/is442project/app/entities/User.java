package com.is442project.app.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.NonNull;
// import javax.persistence.GeneratedValue;
// import javax.persistence.GenerationType;

@Entity
@Getter
@Setter
public class User {
    @Id
    private String email;

    private String name;
    private String password;
    private double bal = 1000;
    private String role = "Customer";

    // default constructor (must include)
    public User (){
    }

    public User (String email, String name){
        this.name = name;
        this.email = email;
    }

    public User (String email, String name, String password) {
        this.email = email;
        this.name = name;
        this.password = password;
    }
    public User (String email, String name, String password, String role) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.role = role;
    }


    public String toString(){
        return "User[" + "email= " + email + ", name= " + name + ", password= " + password + ", bal= " + bal + ", role= " + role + "]";
    }
}
