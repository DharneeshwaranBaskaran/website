package com.example.demo.wish;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

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
public class wishtocart {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";

    @PostMapping("/transferToCart/{id}")
    public ResponseEntity<String> transferCartToHistory(@PathVariable Long id) {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            // Select wish items for the specific ID with state = true
            String selectSql = "SELECT * FROM wish WHERE id = ? AND state = true";
            PreparedStatement selectStatement = connection.prepareStatement(selectSql);
            selectStatement.setLong(1, id);
            ResultSet resultSet = selectStatement.executeQuery();

            while (resultSet.next()) {
                // Check if a row with the same username, topic, and state exists in the cart table
                String checkSql = "SELECT count FROM cart WHERE username = ? AND topic = ? AND state = ?";
                PreparedStatement checkStatement = connection.prepareStatement(checkSql);
                checkStatement.setString(1, resultSet.getString("username"));
                checkStatement.setString(2, resultSet.getString("topic"));
                checkStatement.setBoolean(3, resultSet.getBoolean("state"));
                ResultSet checkResult = checkStatement.executeQuery();

                if (checkResult.next()) {
                    // Row exists, so increment the count
                    int existingCount = checkResult.getInt("count");
                    int newCount = existingCount + resultSet.getInt("count");

                    // Update the count for the existing row
                    String updateSql = "UPDATE cart SET count = ? WHERE username = ? AND topic = ? AND state = ?";
                    PreparedStatement updateStatement = connection.prepareStatement(updateSql);
                    updateStatement.setInt(1, newCount);
                    updateStatement.setString(2, resultSet.getString("username"));
                    updateStatement.setString(3, resultSet.getString("topic"));
                    updateStatement.setBoolean(4, resultSet.getBoolean("state"));
                    updateStatement.executeUpdate();
                } else {
                    // Row doesn't exist, so insert a new row
                    String insertSql = "INSERT INTO cart (topic, description, cost, count, username, state, rating, url, person, seller, weekend) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
                    PreparedStatement insertStatement = connection.prepareStatement(insertSql);

                    insertStatement.setString(1, resultSet.getString("topic"));
                    insertStatement.setString(2, resultSet.getString("description"));
                    insertStatement.setDouble(3, resultSet.getDouble("cost"));
                    insertStatement.setInt(4, resultSet.getInt("count"));
                    insertStatement.setString(5, resultSet.getString("username"));
                    insertStatement.setBoolean(6, resultSet.getBoolean("state"));
                    insertStatement.setDouble(7, resultSet.getDouble("rating"));
                    insertStatement.setString(8, resultSet.getString("url"));
                    insertStatement.setString(9, resultSet.getString("person"));
                    insertStatement.setString(10, resultSet.getString("seller"));
                    insertStatement.setString(11, resultSet.getString("weekend"));

                    int rowsAffected = insertStatement.executeUpdate();
                    if (rowsAffected <= 0) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Data insertion failed");
                    }
                }
            }

            // Set the state to false in the wish table for transferred items
            String updateSql = "UPDATE wish SET state = false WHERE id = ?";
            PreparedStatement updateStatement = connection.prepareStatement(updateSql);
            updateStatement.setLong(1, id);
            updateStatement.executeUpdate();

            return ResponseEntity.ok("Cart items transferred to history for ID: " + id);
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Data insertion failed: " + e.getMessage());
        }
    }

}