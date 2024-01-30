package com.example.demo.Companyaccess;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class companyaccessprovider {

    private final JdbcTemplate jdbcTemplate;

    public companyaccessprovider(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/ty/companyaccess/{username}")
    public ResponseEntity<List<companyaccess>> getComboByPerson(@PathVariable String username) {
        try {
            String sql = "SELECT * FROM companyaccess WHERE username = ?";
             List<companyaccess> accessList = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(companyaccess.class), username);

            return ResponseEntity.ok(accessList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/companyaccess/{username}")
    public ResponseEntity<List<companyaccess>> getComByPerson(@PathVariable String username) {
        try {
            String sql = "SELECT * FROM companyaccess WHERE provider = ?";
            List<companyaccess> accessList = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(companyaccess.class), username);

            return ResponseEntity.ok(accessList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
