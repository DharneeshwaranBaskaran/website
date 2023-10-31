package com.example.demo.Access;
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
public class accessdelete {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";
    @DeleteMapping("/deleteaccess/{id}")
    public ResponseEntity<String> deleteAccessItem(@PathVariable Long id) {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            // Define SQL query to delete a product from the cart table based on its name
            String sql = "DELETE FROM access WHERE id=?";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setLong(1, id);  
            int rowsAffected = preparedStatement.executeUpdate();
            if (rowsAffected > 0) {
                System.out.println("Product deleted successfully: " +id);
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
