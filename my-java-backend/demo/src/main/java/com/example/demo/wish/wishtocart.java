package com.example.demo.wish;

import java.util.List;

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
            String selectSql = "SELECT * FROM wish WHERE id = ? AND state = true";
jdbcTemplate.query(selectSql, (resultSet, rowNum) -> {
    String checkSql = "SELECT count FROM cart WHERE username = ? AND topic = ? AND state = ?";
    
    List<Object> countList = jdbcTemplate.query(checkSql, (countResultSet, countRowNum) ->
            countResultSet.getInt("count"),
            resultSet.getString("username"),
            resultSet.getString("topic"),
            resultSet.getBoolean("state"));

    if (!countList.isEmpty()) {
        int count = (int) countList.get(0);
        int existingCount = count;
        int newCount = existingCount + resultSet.getInt("count");

        String updateSql = "UPDATE cart SET count = ? WHERE username = ? AND topic = ? AND state = ?";
        jdbcTemplate.update(updateSql, newCount,
                resultSet.getString("username"),
                resultSet.getString("topic"),
                resultSet.getBoolean("state"));
    } else {
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
            String updateSql = "UPDATE wish SET state = false WHERE id = ?";
            int rowsAffected = jdbcTemplate.update(updateSql, id);

            if (rowsAffected > 0) {
                return ResponseEntity.ok("Cart items transferred to history for ID: " + id);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Data update failed");
            }
        } catch (Exception e) { 
            System.out.println(e);
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Data operation failed: " + e.getMessage());
        }
    }
}
