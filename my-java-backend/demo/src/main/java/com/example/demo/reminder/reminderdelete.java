package com.example.demo.reminder;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class reminderdelete {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";
    @DeleteMapping("/reminderdelete")
    public ResponseEntity<String> deleteComboItem(@RequestBody reminder reminder) {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            // Define SQL query to delete a product from the cart table based on its name
           Long id=reminder.getId();
        String username = reminder.getUsername();
        
            String sql = "DELETE FROM reminder WHERE id = ? AND username= ?";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setLong(1, id); 
            preparedStatement.setString(2, username);
            
            int rowsAffected = preparedStatement.executeUpdate();
            if (rowsAffected > 0) {
                System.out.println("Product deleted successfully: " + id);
                return ResponseEntity.ok("Product deleted successfully: " + id);
            } else {
                System.out.println("No product found with name: " + id);
                return ResponseEntity.badRequest().body("No product found with name: " + id);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println(e);
            return ResponseEntity.status(500).body("Error deleting product");
        }
    }


    
}
