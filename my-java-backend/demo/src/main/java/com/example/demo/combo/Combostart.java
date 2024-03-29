package com.example.demo.combo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.web.bind.annotation.*;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class Combostart {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public Combostart(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/combodata")
    public ResponseEntity<List<Combo>> getCombo() {
        try {
            String sql = "SELECT * FROM combo WHERE state = ?";
            List<Combo> combos = jdbcTemplate.query(sql, new Object[]{true}, new ComboRowMapper());

            return ResponseEntity.ok(combos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private static class ComboRowMapper implements RowMapper<Combo> {
        @Override
    public Combo mapRow(ResultSet resultSet, int rowNum) throws SQLException {
        BeanPropertyRowMapper<Combo> rowMapper = new BeanPropertyRowMapper<>(Combo.class);
        return rowMapper.mapRow(resultSet, rowNum);
    }
}
}
