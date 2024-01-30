package com.example.demo.History;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class HistoryClear {

    private final JdbcTemplate jdbcTemplate;

    public HistoryClear(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/HistoryClear/{username}")
    public ResponseEntity<String> ClearHistory(@PathVariable String username) {
        try {
            String updateSql = "UPDATE history SET state = ? WHERE username = ?";
            int rowsAffected = jdbcTemplate.update(updateSql, false, username);

            if (rowsAffected > 0) {
                return ResponseEntity.ok("History cleared for username: " + username);
            } else {
                return ResponseEntity.ok("No history found for username: " + username);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
