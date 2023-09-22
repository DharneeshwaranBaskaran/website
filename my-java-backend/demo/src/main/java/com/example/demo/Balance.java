package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class Balance {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/balance/{username}")
    public ResponseEntity<Double> fetchUserBalance(@PathVariable String username) {
        try {
            String sql = "SELECT balance FROM users WHERE username = ?";
            Double balance = jdbcTemplate.queryForObject(sql, Double.class, username);
            
            if (balance != null) {
                return ResponseEntity.ok(balance);
            } else {
                return ResponseEntity.ok(0.0); // Default balance if user not found
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping("/updateUserBalance/{username}")
    public ResponseEntity<String> updateUserBalance(@PathVariable String username, @RequestBody Double newBalance) {
        try {
            String updateBalanceSql = "UPDATE users SET balance = ? WHERE username = ?";
            jdbcTemplate.update(updateBalanceSql, newBalance, username);

            return ResponseEntity.ok("User balance updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user balance");
        }
    }
    
    

}
