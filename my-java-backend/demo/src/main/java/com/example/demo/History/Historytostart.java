package com.example.demo.History;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class Historytostart {

    private final JdbcTemplate jdbcTemplate;

    public Historytostart(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/start")
    public ResponseEntity<List<HistoryItem>> getHistoryItems() {
        try {
            String sql = "SELECT * FROM history";
            List<HistoryItem> historyItems = jdbcTemplate.query(sql,
                    new BeanPropertyRowMapper<>(HistoryItem.class));

            return ResponseEntity.ok(historyItems);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
