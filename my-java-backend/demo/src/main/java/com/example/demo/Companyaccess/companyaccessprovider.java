package com.example.demo.Companyaccess;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api")
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
            List<companyaccess> accessList = jdbcTemplate.query(sql, (resultSet, rowNum) -> {
                companyaccess accesss = new companyaccess();
                accesss.setId(resultSet.getLong("id"));
                accesss.setUsername(resultSet.getString("username"));
                accesss.setType(resultSet.getString("type"));
                accesss.setProvider(resultSet.getString("provider"));
                return accesss;
            }, username);

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
            List<companyaccess> accessList = jdbcTemplate.query(sql, (resultSet, rowNum) -> {
                companyaccess accesss = new companyaccess();
                accesss.setId(resultSet.getLong("id"));
                accesss.setUsername(resultSet.getString("username"));
                accesss.setType(resultSet.getString("type"));
                accesss.setProvider(resultSet.getString("provider"));
                return accesss;
            }, username);

            return ResponseEntity.ok(accessList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
