package com.example.demo.Access;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class editaccess {
     private final JdbcTemplate jdbcTemplate;

    @Autowired
    public editaccess(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/edit/seller")
    public ResponseEntity<String> addDraft(@RequestBody access request) {
        String type = request.getType();
        Long id = request.getId();

        String updateSql = "UPDATE access SET type=? WHERE id= ?";
        int rowsAffected = jdbcTemplate.update(updateSql, type, id);

        if (rowsAffected > 0) {
            System.out.println("Type updated successfully");
            return ResponseEntity.ok("Type updated successfully");
        } else {
            return ResponseEntity.ok("No records updated");
        }
    }
}