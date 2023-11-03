package com.example.demo.wish;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/wish")
@CrossOrigin(origins = "http://localhost:3000")
public class addwish {
    String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    String DB_USER = "root";
    String DB_PASSWORD = "GBds@28102001";

    @PostMapping("/add")
    public ResponseEntity<String> addItemToCart(@RequestBody wishlist cartItem) {
        String topic = cartItem.getTopic();

        // Define a variable to store the combo_id
        Long comboId = getComboIdByTopic(topic);

        if (comboId == null) {
            return ResponseEntity.badRequest().body("Combo with topic not found");
        }

        Double cost = cartItem.getCost();
        int count = cartItem.getCount();
        String username = cartItem.getUsername();
        Double rating = cartItem.getRating();
        String url = cartItem.getUrl();
        String person = cartItem.getPerson();
        String seller = cartItem.getSeller();
        String weekend = cartItem.getWeekend();

        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String sql = "INSERT INTO wish (cost, count, topic, description, username, state, rating, url, person, seller, weekend, combo_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setDouble(1, cost);
            preparedStatement.setInt(2, count);
            preparedStatement.setString(3, topic);
            preparedStatement.setString(4, cartItem.getDescription());
            preparedStatement.setString(5, username);
            preparedStatement.setBoolean(6, true);
            preparedStatement.setDouble(7, rating);
            preparedStatement.setString(8, url);
            preparedStatement.setString(9, person);
            preparedStatement.setString(10, seller);
            preparedStatement.setString(11, weekend);
            preparedStatement.setLong(12, comboId); // Set the combo_id
            int rowsAffected = preparedStatement.executeUpdate();

            if (rowsAffected > 0) {
                System.out.println("Data inserted successfully.");
                System.out.println(seller);
                return ResponseEntity.ok("Data inserted successfully");
            } else {
                System.out.println("Data insertion failed.");
                return ResponseEntity.badRequest().body("Data insertion failed");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println(e);
            return ResponseEntity.badRequest().body("Data insertion failed");
        }
    }

    // Method to get combo_id by topic using native SQL query
    private Long getComboIdByTopic(String topic) {
        Long comboId = null;
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String sql = "SELECT id FROM combo WHERE topic = ?";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, topic);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                comboId = resultSet.getLong("id");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return comboId;
    }
}
