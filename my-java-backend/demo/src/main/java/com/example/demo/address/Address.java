package com.example.demo.address;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class Address {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/address/{username}")
    public ResponseEntity<String> fetchUserAddress(@PathVariable String username) {
        try {
            String sql = "SELECT address FROM users WHERE username = ?";
            String address = jdbcTemplate.queryForObject(sql, String.class, username);

            if (address != null) {
                return ResponseEntity.ok(address);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/updateAddress/{username}")
    public ResponseEntity<String> updateUserAddress(@PathVariable String username, @RequestBody String newAddress) {
        try {
            String updateAddressSql = "UPDATE users SET address = ? WHERE username = ?";
            int rowsAffected = jdbcTemplate.update(updateAddressSql, newAddress, username);

            if (rowsAffected > 0) {
                return ResponseEntity.ok("User address updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user address");
        }
    }

    @PostMapping("/updateEmail/{username}")
    public ResponseEntity<String> updateUserEmail(@PathVariable String username, @RequestBody String newEmail) {
        try {
            String updateEmailSql = "UPDATE users SET email = ? WHERE username = ?";
            int rowsAffected = jdbcTemplate.update(updateEmailSql, newEmail, username);

            if (rowsAffected > 0) {
                return ResponseEntity.ok("User email updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user email");
        }
    }
}
