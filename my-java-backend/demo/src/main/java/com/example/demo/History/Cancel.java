package com.example.demo.History;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class Cancel {

    private final JdbcTemplate jdbcTemplate;

    public Cancel(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/cancel/{id}")
    public ResponseEntity<Map<String, String>> UpdateHistory(@PathVariable Long id) {
        try {
            String updateSql = "UPDATE history SET state = ? WHERE id = ?";
            int rowsAffected = jdbcTemplate.update(updateSql, false, id);
            if (rowsAffected > 0) {
                System.out.println("Product cancelled:" + id);
                Map<String, String> response = new HashMap<>();
                response.put("message", "Product cancelled:" + id);
                return ResponseEntity.ok(response);
            } else {
                System.out.println("Product not found with id: " + id);
                return ResponseEntity.badRequest().body(null); 
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null); 
        }
    }
}
