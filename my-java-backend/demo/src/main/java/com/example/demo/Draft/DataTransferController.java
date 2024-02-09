package com.example.demo.Draft;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class DataTransferController {

    private final JdbcTemplate jdbcTemplate;

    public DataTransferController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/transferdata/{id}")
    public ResponseEntity<String> transferDraftToCombo(@PathVariable Long id) {
        try {
            String checkIdQuery = "SELECT COUNT(*) FROM combo WHERE id = ? AND state = ?";
            int rowCount = jdbcTemplate.queryForObject(checkIdQuery, Integer.class, id, false);

            if (rowCount == 0) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"error\": \"Combo record not found.\"}");
            }

            String updateSql = "UPDATE combo SET state = true WHERE id = ?";
            int rowsAffected = jdbcTemplate.update(updateSql, id);

            if (rowsAffected > 0) {
                return ResponseEntity.ok("Updated successfully");
            } else {
                System.out.println("No product found with id " + id);
                return ResponseEntity.badRequest().body("No product found with id: " + id);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"An error occurred: " + e + "\"}");
        }
    }
}
