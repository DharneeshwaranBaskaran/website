package com.example.demo.wish;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
@Controller
@CrossOrigin(origins = "http://localhost:3000")
public class wishremove {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public wishremove(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PutMapping("/updatewish/{id}/{username}")
    public ResponseEntity<String> updateWishItemState(@PathVariable Long id, @PathVariable String username) {
        try {
            String sql = "UPDATE wish SET state = ? WHERE id = ? AND username = ? AND state = ?";
            int rowsAffected = jdbcTemplate.update(sql, false, id, username, true);

            if (rowsAffected > 0) {
                System.out.println("Product state updated successfully: " + id);
                return ResponseEntity.ok("Product state updated successfully: " + id);
            } else {
                System.out.println("No product found with id: " + id + " and username: " + username + " or the state is not true.");
                return ResponseEntity.badRequest().body("No product found with id: " + id + " and username: " + username + " or the state is not true.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating product state");
        }
    }
}
