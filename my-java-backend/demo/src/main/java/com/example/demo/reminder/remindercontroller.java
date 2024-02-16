package com.example.demo.reminder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@Controller
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class remindercontroller {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public remindercontroller(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/reminder")
    public ResponseEntity<String> addItemToCart(@RequestBody reminder reminder) {
        String topic = reminder.getTopic();
        String username = reminder.getUsername();
        Long id = reminder.getCombo_id();

        try {
            String sql = "INSERT INTO reminder (topic, username, state, combo_id) VALUES (?, ?, ?, ?)";
            int rowsAffected = jdbcTemplate.update(sql, topic, username, false, id);

            if (rowsAffected > 0) {
                System.out.println("Data inserted successfully.");
                return ResponseEntity.ok("Data inserted successfully");
            } else {
                System.out.println("Data insertion failed.");
                return ResponseEntity.badRequest().body("Data insertion failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(Objects.requireNonNull(e.getMessage()));
            return ResponseEntity.badRequest().body("Data insertion failed");
        }
    }
}
