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
public class reminderdelete {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public reminderdelete(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @DeleteMapping("/reminderdelete")
    public ResponseEntity<String> deleteReminder(@RequestBody reminder reminder) {
        try {
            Long id = reminder.getId();
            String username = reminder.getUsername();

            String sql = "DELETE FROM reminder WHERE id = ? AND username = ?";
            int rowsAffected = jdbcTemplate.update(sql, id, username);

            if (rowsAffected > 0) {
                System.out.println("Reminder deleted successfully: " + id);
                return ResponseEntity.ok("Reminder deleted successfully: " + id);
            } else {
                System.out.println("No reminder found with id: " + id);
                return ResponseEntity.badRequest().body("No reminder found with id: " + id);
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(Objects.requireNonNull(e.getMessage()));
            return ResponseEntity.status(500).body("Error deleting reminder");
        }
    }
}
