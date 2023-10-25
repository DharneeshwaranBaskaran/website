package com.example.demo.combo;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ComboDelete {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";

    @DeleteMapping("/deletecombo/{productName}/{Username}")
    public ResponseEntity<String> deleteComboItem(@PathVariable String productName,@PathVariable String Username) {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            // Define SQL query to delete a product from the cart table based on its name
            String sql = "DELETE FROM combo WHERE topic = ? AND seller= ?";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, productName); 
            preparedStatement.setString(2, Username);
            
            int rowsAffected = preparedStatement.executeUpdate();
            if (rowsAffected > 0) {
                System.out.println("Product deleted successfully: " + productName);
                return ResponseEntity.ok("Product deleted successfully: " + productName);
            } else {
                System.out.println("No product found with name: " + productName);
                return ResponseEntity.badRequest().body("No product found with name: " + productName);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println(e);
            return ResponseEntity.status(500).body("Error deleting product");
        }
    }
}

    
