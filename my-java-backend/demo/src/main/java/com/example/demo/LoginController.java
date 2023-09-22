package com.example.demo;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        String jdbcUrl = "jdbc:mysql://localhost:3306/ecom";
        String username = "root";
        String password = "GBds@28102001";

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password)) {
            String sql = "SELECT username, password FROM users WHERE username = ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setString(1, loginRequest.getUsername());

                try (ResultSet resultSet = statement.executeQuery()) {
                    if (resultSet.next()) {
                        //String retrievedUsername = resultSet.getString("username");
                        String retrievedPassword = resultSet.getString("password");

                        if (retrievedPassword.equals(loginRequest.getPassword())) {
                            return ResponseEntity.ok("Login successful!");
                        } else {
                            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password.");
                        }
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Username not found.");
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }
    @PostMapping("/seller")
    public ResponseEntity<String> seller(@RequestBody LoginRequest loginRequest) {
        String jdbcUrl = "jdbc:mysql://localhost:3306/ecom";
        String username = "root";
        String password = "GBds@28102001";

        try (Connection connection = DriverManager.getConnection(jdbcUrl, username, password)) {
            String sql = "SELECT username, password FROM seller WHERE username = ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setString(1, loginRequest.getUsername());

                try (ResultSet resultSet = statement.executeQuery()) {
                    if (resultSet.next()) {
                        //String retrievedUsername = resultSet.getString("username");
                        String retrievedPassword = resultSet.getString("password");

                        if (retrievedPassword.equals(loginRequest.getPassword())) {
                            return ResponseEntity.ok("Login successful!");
                        } else {
                            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password.");
                        }
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Username not found.");
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }
}