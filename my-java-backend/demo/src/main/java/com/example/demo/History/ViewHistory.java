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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "http://localhost:3000")
public class ViewHistory {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";

    @GetMapping("/view")
    public ResponseEntity<List<HistoryItem>> getHistoryItems() {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String sql = "SELECT * FROM history";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();

            List<HistoryItem> historyItems = new ArrayList<>();
            while (resultSet.next()) {
                HistoryItem historyItem = new HistoryItem();
                historyItem.setCost(resultSet.getDouble("cost"));
                historyItem.setCount(resultSet.getInt("count"));
                historyItem.setName(resultSet.getString("name"));
                historyItem.setDescription(resultSet.getString("description"));
                historyItem.setUsername(resultSet.getString("username"));
                historyItem.setState(resultSet.getBoolean("state"));
                historyItem.setRating(resultSet.getDouble("rating")); 
                historyItem.setUrl(resultSet.getString("url"));
                // Set other properties of HistoryItem as needed

                historyItems.add(historyItem);
            }

            return ResponseEntity.ok(historyItems);
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}