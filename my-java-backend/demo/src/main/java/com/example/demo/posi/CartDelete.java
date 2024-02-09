package com.example.demo.posi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
public class CartDelete {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public CartDelete(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PutMapping("/update/{id}/{username}")
    public ResponseEntity<String> updateCartItemState(@PathVariable Long id, @PathVariable String username) {
        try {
            String updateSql = "UPDATE cart SET state = ? WHERE id = ? AND username = ?";
            int rowsAffected = jdbcTemplate.update(updateSql, false, id, username);

            if (rowsAffected > 0) {
                System.out.println("Product state updated successfully: " + id);
                return ResponseEntity.ok("Product state updated successfully: " + id);
            } else {
                System.out.println("No product found with id: " + id + " for the user: " + username + " or the state is not true.");
                return ResponseEntity.badRequest().body("No product found with id: " + id + " for the user: " + username + " or the state is not true.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating product state");
        }
    }
}
