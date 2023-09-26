package com.example.demo.History;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class History {
        String DB_URL = "jdbc:mysql://localhost:3306/ecom";
        String DB_USER = "root";
        String DB_PASSWORD = "GBds@28102001";
        @PostMapping("/transferToHistory/{username}")
            public ResponseEntity<String> transferCartToHistory(@PathVariable String username) {
                try (Connection connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
                    // Select cart items for the specific username
                    String selectSql = "SELECT * FROM cart WHERE username = ? AND state = ?";
                    PreparedStatement selectStatement = connection.prepareStatement(selectSql);
                    selectStatement.setString(1, username); 
                    selectStatement.setBoolean(2, true);
                    ResultSet resultSet = selectStatement.executeQuery();

                    // Insert selected cart items into the history table
                    String insertSql = "INSERT INTO history (name, description, cost, count, username,state,rating,url) VALUES (?,?,?,?,?,?,?,?)";
                    PreparedStatement insertStatement = connection.prepareStatement(insertSql);

                    while (resultSet.next()) {
                        insertStatement.setString(1, resultSet.getString("name"));
                        insertStatement.setString(2, resultSet.getString("description"));
                        insertStatement.setDouble(3, resultSet.getDouble("cost"));
                        insertStatement.setInt(4, resultSet.getInt("count"));
                        insertStatement.setString(5, resultSet.getString("username"));
                        insertStatement.setBoolean(6,resultSet.getBoolean("state"));
                        insertStatement.setDouble(7,resultSet.getDouble("rating"));
                        insertStatement.setString(8, resultSet.getString("url"));
                        insertStatement.executeUpdate();
                    }

                    String updateSql = "UPDATE cart SET state = ? WHERE username = ?";
                    PreparedStatement deleteStatement = connection.prepareStatement(updateSql);
                    deleteStatement.setBoolean(1, false);
                    deleteStatement.setString(2, username);
                    deleteStatement.executeUpdate();

                    return ResponseEntity.ok("Cart items transferred to history for username: " + username);
                } catch (SQLException e) {
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
            }
        }