package com.example.demo.History;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class Cancel {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";
    @PostMapping("/cancel/{id}")
    public ResponseEntity<Map<String, String>> UpdateHistory(@PathVariable Long id) {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String updateSql = "UPDATE history SET state = ? WHERE id = ?";
            PreparedStatement updateStatement = connection.prepareStatement(updateSql); 
            updateStatement.setBoolean(1, false); 
            updateStatement.setLong(2, id);
            
            int rowsAffected = updateStatement.executeUpdate();
        if (rowsAffected > 0) {
                    System.out.println("Product cancelled:" + id);
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Product cancelled:" + id);
                    return ResponseEntity.ok(response);
                } else {
                    System.out.println("Product cancelled:" + id);
                    return ResponseEntity.badRequest().body(null);
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
            return ResponseEntity.ok(null);
        }
}