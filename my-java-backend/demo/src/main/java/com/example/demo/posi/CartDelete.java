package com.example.demo.posi;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class CartDelete {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";

    @PutMapping("/update/{productName}/{Username}")
public ResponseEntity<String> updateCartItemState(@PathVariable String productName, @PathVariable String Username) {
    try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
        // Define SQL query to update the state of a product in the cart table based on its name and username
        String sql = "UPDATE cart SET state = ? WHERE topic = ? AND Username = ? AND state = ?";
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
        preparedStatement.setBoolean(1, false);
        preparedStatement.setString(2, productName);
        preparedStatement.setString(3, Username);
        preparedStatement.setBoolean(4, true); // Only update if state is already true
        int rowsAffected = preparedStatement.executeUpdate();

        if (rowsAffected > 0) {
            System.out.println("Product state updated successfully: " + productName);
            return ResponseEntity.ok("Product state updated successfully: " + productName);
        } else {
            System.out.println("No product found with name: " + productName + " and username: " + Username + " or the state is not true.");
            return ResponseEntity.badRequest().body("No product found with name: " + productName + " and username: " + Username + " or the state is not true.");
        }
    } catch (SQLException e) {
        e.printStackTrace();
        System.out.println(e);
        return ResponseEntity.status(500).body("Error updating product state");
    }
    }
}
