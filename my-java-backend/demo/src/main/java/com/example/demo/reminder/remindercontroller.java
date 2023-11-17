package com.example.demo.reminder;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class remindercontroller {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";

    @PostMapping("/reminder")
    public ResponseEntity<String> addItemToCart(@RequestBody reminder reminder) {
        String topic = reminder.getTopic();
        String username = reminder.getUsername();
        Long id=reminder.getCombo_id();
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String sql = "INSERT INTO reminder (topic, username, state,combo_id) VALUES (?, ?, ?,?)";
            try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
                preparedStatement.setString(1, topic);
                preparedStatement.setString(2, username);
                preparedStatement.setBoolean(3, false);
                preparedStatement.setLong(4, id);
                
                int rowsAffected = preparedStatement.executeUpdate();
                if (rowsAffected > 0) {
                    System.out.println("Data inserted successfully.");
                    return ResponseEntity.ok("Data inserted successfully");
                } else {
                    System.out.println("Data insertion failed.");
                    return ResponseEntity.badRequest().body("Data insertion failed");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace(); 
            System.out.println(e);
            return ResponseEntity.badRequest().body("Data insertion failed");
        }
    }
}
