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
            String checkIdQuery = "SELECT * FROM draft WHERE id = ?";
            PreparedStatement checkIdStatement = connection.prepareStatement(checkIdQuery);
            checkIdStatement.setLong(1, id);

            ResultSet resultSet = checkIdStatement.executeQuery();
            if (!resultSet.next()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Draft record not found.\"}");
            }
            // String checkUsernameQuery = "SELECT * FROM combo WHERE id = ?";
            //     PreparedStatement checkUsernameStatement = connection.prepareStatement(checkUsernameQuery);
            //     checkUsernameStatement.setLong(1, id);
            //     if (checkUsernameStatement.executeQuery().next()) {
            //         return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"Key already exists in Database.\"}");
            //     }
            // Fetch data from the draft table
            String fetchDataQuery = "SELECT * FROM draft WHERE id = ?";
            PreparedStatement fetchDataStatement = connection.prepareStatement(fetchDataQuery);
            fetchDataStatement.setLong(1, id);
            ResultSet draftData = fetchDataStatement.executeQuery();

            // Transfer data to the combo table
            String transferDataQuery = "INSERT INTO combo (id, topic, description, url, cat, cost, rating, person, refnum) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            PreparedStatement transferDataStatement = connection.prepareStatement(transferDataQuery);

            if (draftData.next()) {
                transferDataStatement.setLong(1, draftData.getLong("id"));
                transferDataStatement.setString(2, draftData.getString("topic"));
                transferDataStatement.setString(3, draftData.getString("description"));
                transferDataStatement.setString(4, draftData.getString("url"));
                transferDataStatement.setString(5, draftData.getString("cat"));
                transferDataStatement.setInt(6, draftData.getInt("cost"));
                transferDataStatement.setDouble(7, draftData.getDouble("rating"));
                transferDataStatement.setString(8, draftData.getString("person"));
                transferDataStatement.setLong(9, draftData.getLong("refnum"));

                int rowsAffected = transferDataStatement.executeUpdate();
                if (rowsAffected > 0) {
                    // If the data transfer was successful, you can optionally delete the data from the draft table
                    String deleteDataQuery = "DELETE FROM draft WHERE id = ?";
                    PreparedStatement deleteDataStatement = connection.prepareStatement(deleteDataQuery);
                    deleteDataStatement.setLong(1, id);
                    deleteDataStatement.executeUpdate();
                    connection.setAutoCommit(false);
                    connection.commit(); // Commit the transaction
                    System.out.println("Draft data transferred to combo successfully.");
                } else {
                    System.out.println("Data transfer from draft to combo failed.");
                }
            }

            return ResponseEntity.ok("Data Transfer Completed");
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Database error: " +e+ "\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"An error occurred: " +e+ "\"}");
        }
        
    }
}