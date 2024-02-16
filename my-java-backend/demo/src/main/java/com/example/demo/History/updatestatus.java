package com.example.demo.History;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class updatestatus {

    private final JdbcTemplate jdbcTemplate;

    public updatestatus(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/updatestatus")
    public ResponseEntity<String> addDraft(@RequestBody HistoryItem request) {

        Long id = request.getId();
        String status=request.getStatus();
        try {
            String updateSql = "UPDATE history SET status =? WHERE id=?";
            int rowsAffected = jdbcTemplate.update(updateSql, status, id);

            if (rowsAffected > 0) {
                System.out.println("Type updated successfully");
                return ResponseEntity.ok("Type updated successfully");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok("Update successful");
    }
}
