package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
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
                return ResponseEntity.ok(0.0);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/loyalty/{username}")
    public ResponseEntity<Double> fetchUserloyalty(@PathVariable String username) {
        try {
            String sql = "SELECT loyalty FROM users WHERE username = ?";
            Double loyalty = jdbcTemplate.queryForObject(sql, Double.class, username);
            
            if (loyalty != null) {
                return ResponseEntity.ok(loyalty);
            } else {
                return ResponseEntity.ok(0.0);
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
    
    @PostMapping("/updateUserloyalty/{username}")
    public ResponseEntity<String> loyalty(@PathVariable String username, @RequestBody Double loy) {
        try {
            String updateBalanceSql = "UPDATE users SET loyalty = ? WHERE username = ?";
            jdbcTemplate.update(updateBalanceSql, loy, username);

            return ResponseEntity.ok("User loyalty updated successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user balance");
        }
    }
    @PostMapping("/updateUserloyBalance/{username}")
public ResponseEntity<String> updateUserBalanceloy(@PathVariable String username, @RequestBody Double newBalance) {
  try {
    String updateBalanceSql = "UPDATE users SET balance = ? WHERE username = ?";
    jdbcTemplate.update(updateBalanceSql, newBalance, username);
    String updateLoyaltySql = "UPDATE users SET loyalty = ? WHERE username = ?";
    jdbcTemplate.update(updateLoyaltySql,0, username);
    return ResponseEntity.ok("User balance updated successfully");
  } catch (Exception e) {
    e.printStackTrace();
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user balance");
  }
}
}
