package com.example.demo;

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
public class Address {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";

    @GetMapping("/address/{username}")
    public ResponseEntity<String> fetchUserAddress(@PathVariable String username) {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String sql = "SELECT address FROM users WHERE username = ?";
            PreparedStatement selectStatement = connection.prepareStatement(sql);
            selectStatement.setString(1, username);
            ResultSet resultSet = selectStatement.executeQuery();

            if (resultSet.next()) {
                // Retrieve the 'address' as a string from the result set
                String address = resultSet.getString("address");
                return ResponseEntity.ok(address);
            } else {
                // Handle the case where no data was found for the given username
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping("/updateAddress/{username}")
    public ResponseEntity<String> updateUserAddress(@PathVariable String username, @RequestBody String newAddress) {
        try {
            String updateAddressSql = "UPDATE users SET address = ? WHERE username = ?";
            try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
                PreparedStatement preparedStatement = connection.prepareStatement(updateAddressSql);  // Change variable name here
                preparedStatement.setString(1, newAddress);
                preparedStatement.setString(2, username);
                int rowsAffected = preparedStatement.executeUpdate();

                if (rowsAffected > 0) {
                    return ResponseEntity.ok("User address updated successfully");
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
                }
            } catch (SQLException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user address");
            }
        } catch (Exception e) {
            System.out.println(e);
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user address");
        }
    }
}