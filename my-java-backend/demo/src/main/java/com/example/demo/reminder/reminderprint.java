package com.example.demo.reminder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
public class reminderprint {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public reminderprint(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/reminder/getItems/{username}")
    public ResponseEntity<List<reminder>> getRemindersForUsername(@PathVariable String username) {
        try {
            String sql = "SELECT * FROM reminder WHERE username = ? AND state = ?";
            List<reminder> reminders = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(reminder.class), username, true);

            return ResponseEntity.ok(reminders);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
