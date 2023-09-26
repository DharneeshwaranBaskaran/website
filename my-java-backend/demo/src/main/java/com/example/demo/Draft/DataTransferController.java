package com.example.demo.Draft;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class DataTransferController {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "GBds@28102001";

    @PostMapping("/transferdata/{id}")
    public ResponseEntity<String> transferDraftToCombo(@PathVariable Long id) {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            // Check if the record with the given ID exists in the draft table
            String checkIdQuery = "SELECT * FROM combo WHERE id = ? AND state = ?";
            PreparedStatement checkIdStatement = connection.prepareStatement(checkIdQuery);
            checkIdStatement.setLong(1, id);
            checkIdStatement.setBoolean(2, false);
            ResultSet resultSet = checkIdStatement.executeQuery();
            if (!resultSet.next()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"Draft record not found.\"}");
            }
            String updateSql = "UPDATE combo SET state = ? WHERE id = ? ";
            PreparedStatement updateStatement = connection.prepareStatement(updateSql);
            updateStatement.setBoolean(1, true);
            updateStatement.setLong(2, id);
            int rowsAffected = updateStatement.executeUpdate();
            if (rowsAffected > 0) {
                
                return ResponseEntity.ok("updated successfully");
            } else {
                System.out.println("No product found with id " + id);
                return ResponseEntity.badRequest().body("No product found with name: " + id);
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Database error: " +e+ "\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"An error occurred: " +e+ "\"}");
        }
        
    }
}