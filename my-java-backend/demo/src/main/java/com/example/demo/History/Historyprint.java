package com.example.demo.History;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class Historyprint {

    private final JdbcTemplate jdbcTemplate;

    public Historyprint(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/history/{username}")
    public ResponseEntity<List<HistoryItem>> getHistoryItemsForUsername(@PathVariable String username) {
        try {
            String sql = "SELECT * FROM history WHERE username = ? AND state = ?";
            List<HistoryItem> historyItems = jdbcTemplate.query(sql,
                    new BeanPropertyRowMapper<>(HistoryItem.class), username, true);

            return ResponseEntity.ok(historyItems);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
