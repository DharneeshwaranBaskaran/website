package com.example.demo.History;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class Weekend {

    private final JdbcTemplate jdbcTemplate;

    public Weekend(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/updateweekend")
    public ResponseEntity<String> updateWeekend(@RequestBody HistoryItem request) {
        String weekend = request.getWeekend();
        String username = request.getUsername();

        try {
            String updateSql = "UPDATE history SET weekend = ? WHERE username = ? AND state = ?";
            int rowsAffected = jdbcTemplate.update(updateSql, weekend, username, true);

            if (rowsAffected > 0) {
                System.out.println("Weekend updated successfully");
                return ResponseEntity.ok("Weekend updated successfully");
            } else {
                System.out.println("No matching record found for username: " + username);
                return ResponseEntity.badRequest().body("No matching record found for username: " + username);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}


