package com.example.demo.wish;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class wishtocart {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public wishtocart(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/transferToCart/{id}")
    public ResponseEntity<String> transferCartToHistory(@PathVariable Long id) {
        try {
            // Select wish items for the specific ID with state = true
            String selectSql = "SELECT * FROM wish WHERE id = ? AND state = true";
            jdbcTemplate.query(selectSql, (resultSet, rowNum) -> {
                // Check if a row with the same username, topic, and state exists in the cart table
                String checkSql = "SELECT count FROM cart WHERE username = ? AND topic = ? AND state = ?";
                int count = jdbcTemplate.queryForObject(checkSql, Integer.class,
                        resultSet.getString("username"),
                        resultSet.getString("topic"),
                        resultSet.getBoolean("state"));

                if (count > 0) {
                    // Row exists, so increment the count
                    int existingCount = count;
                    int newCount = existingCount + resultSet.getInt("count");

                    // Update the count for the existing row
                    String updateSql = "UPDATE cart SET count = ? WHERE username = ? AND topic = ? AND state = ?";
                    jdbcTemplate.update(updateSql, newCount,
                            resultSet.getString("username"),
                            resultSet.getString("topic"),
                            resultSet.getBoolean("state"));
                } else {
                    // Row doesn't exist, so insert a new row
                    String insertSql = "INSERT INTO cart (topic, description, cost, count, username, state, rating, url, person, seller, weekend) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
                    jdbcTemplate.update(insertSql,
                            resultSet.getString("topic"),
                            resultSet.getString("description"),
                            resultSet.getDouble("cost"),
                            resultSet.getInt("count"),
                            resultSet.getString("username"),
                            resultSet.getBoolean("state"),
                            resultSet.getDouble("rating"),
                            resultSet.getString("url"),
                            resultSet.getString("person"),
                            resultSet.getString("seller"),
                            resultSet.getString("weekend"));
                }
                return null;
            }, id);

            // Set the state to false in the wish table for transferred items
            String updateSql = "UPDATE wish SET state = false WHERE id = ?";
            int rowsAffected = jdbcTemplate.update(updateSql, id);

            if (rowsAffected > 0) {
                return ResponseEntity.ok("Cart items transferred to history for ID: " + id);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Data update failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Data operation failed: " + e.getMessage());
        }
    }
}
