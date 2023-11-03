package com.example.demo.wish;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class updateWish {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";
    @PostMapping("/update/wish/{topic}/{username}")
     public ResponseEntity<String> UpdateCart(@PathVariable String topic,@RequestBody wishlist cartItem,@PathVariable String username) {
        int count=cartItem.getCount(); 
        Boolean state=true;
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String selectSql = "SELECT count FROM wish WHERE topic = ? AND username = ? AND state = ?";
            PreparedStatement selectStatement = connection.prepareStatement(selectSql);
            selectStatement.setString(1, topic);
            selectStatement.setString(2, username);
            selectStatement.setBoolean(3, state);
            ResultSet resultSet = selectStatement.executeQuery();
            int currentCount = 0;
            if (resultSet.next()) {
                currentCount = resultSet.getInt("count");
            }
            int newCount = currentCount + count;  
            String updateSql = "UPDATE wish SET count = ? WHERE topic = ? AND username = ? AND  state = ?";
            PreparedStatement updateStatement = connection.prepareStatement(updateSql);
            updateStatement.setInt(1, newCount);
            updateStatement.setString(2, topic);
            updateStatement.setString(3, username); 
            updateStatement.setBoolean(4, state);
            int rowsAffected = updateStatement.executeUpdate();
            if (rowsAffected > 0) {
                System.out.println("Count updated successfully for product: " + topic);
                return ResponseEntity.ok("Count updated successfully for product: " + topic);
            } else {
                System.out.println("No product found with name: " + topic);
                return ResponseEntity.badRequest().body("No product found with name: " + topic);
            }
        
            } catch (SQLException e) {
                e.printStackTrace();
            }
             return ResponseEntity.ok("Registered successful"); 
        }
}
