package com.example.demo.History;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class HistoryClear {
        String DB_URL = "jdbc:mysql://localhost:3306/ecom";
        String DB_USER = "root";
        String DB_PASSWORD = "GBds@28102001"; 
        @PostMapping("/HistoryClear/{username}")

        
        
            public ResponseEntity<String> ClearHistory(@PathVariable String username) {
                try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
                    // Select cart items for the specific username
                    String selectSql = "SELECT state FROM history WHERE username = ? ";
                    PreparedStatement selectStatement = connection.prepareStatement(selectSql);
                    selectStatement.setString(1, username); 
                    String updateSql = "UPDATE history SET state = ? WHERE username = ?";
                    PreparedStatement deleteStatement = connection.prepareStatement(updateSql);
                    deleteStatement.setBoolean(1, false);
                    deleteStatement.setString(2, username);
                    deleteStatement.executeUpdate();

                    return ResponseEntity.ok("Cart items transferred to history for username: " + username);
                } catch (SQLException e) {
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            }
        }
        