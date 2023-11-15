package com.example.demo.wish;
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
public class wishremove {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";

    @PutMapping("/updatewish/{id}/{Username}")
public ResponseEntity<String> updateCartItemState(@PathVariable Long id, @PathVariable String Username) {
    try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
        // Define SQL query to update the state of a product in the cart table based on its name and username
        String sql = "UPDATE wish SET state = ? WHERE id=?";
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
        preparedStatement.setBoolean(1, false);
        preparedStatement.setLong(2,id);
        // Only update if state is already true
        int rowsAffected = preparedStatement.executeUpdate();

        if (rowsAffected > 0) {
            System.out.println("Product state updated successfully: " + id);
            return ResponseEntity.ok("Product state updated successfully: " + id);
        } else {
            System.out.println("No product found with name: " + id + " and username: " + Username + " or the state is not true.");
            return ResponseEntity.badRequest().body("No product found with name: " + id + " and username: " + Username + " or the state is not true.");
        }
    } catch (SQLException e) {
        e.printStackTrace();
        System.out.println(e);
        return ResponseEntity.status(500).body("Error updating product state");
    }
    }
}
