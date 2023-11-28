package com.example.demo.combo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;

@Controller
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class update {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public update(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/editdata")
    public ResponseEntity<String> updateCost(@RequestBody Comborequest request) {
        Integer cost = request.getCost();
        Long id = request.getId();

        try {
            String updateSql = "UPDATE combo SET cost=? WHERE id= ?";
            int rowsAffected = jdbcTemplate.update(updateSql, cost, id);

            if (rowsAffected > 0) {
                System.out.println("Cost updated successfully");
                return ResponseEntity.ok("Cost updated successfully ");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok("Registered successful");
    }
}
