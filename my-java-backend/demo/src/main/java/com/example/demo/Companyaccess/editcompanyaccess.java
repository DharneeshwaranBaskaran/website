package com.example.demo.Companyaccess;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class editcompanyaccess {

    private final JdbcTemplate jdbcTemplate;

    public editcompanyaccess(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/edit/company")
    public ResponseEntity<String> addDraft(@RequestBody companyaccess request) {

        String type = request.getType();
        Long id = request.getId();

        try {
            String updateSql = "UPDATE companyaccess SET type=? WHERE id=?";
            int rowsAffected = jdbcTemplate.update(updateSql, type, id);

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
