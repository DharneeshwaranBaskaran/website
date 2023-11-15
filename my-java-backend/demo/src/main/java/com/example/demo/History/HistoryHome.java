package com.example.demo.History;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class HistoryHome {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";
    @GetMapping("/historyhome/{username}")
    public ResponseEntity<List<HistoryItem>> getHistoryItemsForUsername(@PathVariable String username) {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String sql = "SELECT * FROM history WHERE username = ?";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, username);
            
            
            ResultSet resultSet = preparedStatement.executeQuery();

            List<HistoryItem> historyItems = new ArrayList<>();

            while (resultSet.next()) {
                HistoryItem historyItem = new HistoryItem(); 
                historyItem.setId(resultSet.getLong("combo_id"));
                historyItem.setTopic(resultSet.getString("topic"));
                historyItem.setDescription(resultSet.getString("description"));
                historyItem.setCost(resultSet.getDouble("cost"));
                historyItem.setCount(resultSet.getInt("count"));
                historyItem.setUsername(resultSet.getString("username")); 
                historyItem.setState(resultSet.getBoolean("state"));
                historyItem.setRating(resultSet.getDouble("rating")); 
                historyItem.setUrl(resultSet.getString("url"));
                historyItem.setPerson(resultSet.getString("person"));
                historyItem.setSeller(resultSet.getString("seller"));
                historyItems.add(historyItem);
            }

            return ResponseEntity.ok(historyItems);
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}