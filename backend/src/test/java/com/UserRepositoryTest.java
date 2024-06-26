package com;

import static org.junit.jupiter.api.Assertions.assertEquals;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import com.is442project.app.entities.User;
import com.is442project.app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;


// @DataJpaTest
// @TestPropertySource(properties = {
//     "spring.datasource.url=jdbc:sqlite:app.db",
//     "spring.datasource.driver-class-name=org.sqlite.JDBC",
//     "spring.jpa.database-platform=org.hibernate.dialect.SQLiteDialect"
// })
// public class UserRepositoryTest {

//     @Autowired
//     private UserRepository userRepository;

//     @Test
//     public void testQueryDatabase() {
//         List<User> users = userRepository.findAll();
//         for (User user : users) {
//             System.out.println("User ID: " + user.getUserID());
//             // System.out.println("Username: " + user.getUsername());
//             // System.out.println("Email: " + user.getEmail());
//             System.out.println("-----------------------");
//         }
//     }
// }


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class UserRepositoryTest {

    public static void main(String[] args) {
        String url = "jdbc:sqlite:app.db"; // Replace this with your actual database path
        String query = "SELECT * FROM USER"; // Replace this with your actual table name

        try (Connection conn = DriverManager.getConnection(url);
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(query)) {

            // Print out the data
            while (rs.next()) {
                int id = rs.getInt("userId"); // Replace "id" with the actual column name
                String username = rs.getString("username"); // Replace "username" with the actual column name
                String email = rs.getString("email"); // Replace "email" with the actual column name
                System.out.println("ID: " + id + ", Username: " + username + ", Email: " + email);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}