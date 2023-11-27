package com.example.demo.loginregister;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class userprint {
    private final String DB_URL = "jdbc:mysql://localhost:3306/ecom";
    private final String DB_USER = "root";
    private final String DB_PASSWORD = "GBds@28102001";

    @GetMapping("/user/{username}")
    public ResponseEntity<List<User>> getComboByPerson(@PathVariable String username) {
        try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            String sql = "SELECT * FROM users WHERE username = ?";
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, username);
            ResultSet resultSet = preparedStatement.executeQuery();

            List<User> combos = new ArrayList<>();

            while (resultSet.next()) {
                User combo = new User();
                combo.setId(resultSet.getLong("id"));
                combo.setUsername(resultSet.getString("username"));
                combo.setEmail(resultSet.getString("email"));
                combo.setAddress(resultSet.getString("address")); 
               combo.setBalance(resultSet.getLong("balance")); 
               combo.setProfilepic(resultSet.getString("profilepic"));
                combos.add(combo);
            }
            return ResponseEntity.ok(combos);
        } catch (SQLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
