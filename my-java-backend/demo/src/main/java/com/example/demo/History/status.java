package com.example.demo.History;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
public class status {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public status(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/status/{username}")
    public ResponseEntity<List<HistoryItem>> getHistoryItems(@PathVariable String username) {
        try {
            String sql = "SELECT * FROM history WHERE seller = ?";
            List<HistoryItem> historyItems = jdbcTemplate.query(sql, (resultSet, rowNum) -> {
                BeanPropertyRowMapper<HistoryItem> rowMapper = new BeanPropertyRowMapper<>(HistoryItem.class);
                return rowMapper.mapRow(resultSet, rowNum);
            }, username);
            return ResponseEntity.ok(historyItems);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
