package com.example.demo.combo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
public class ViewHistory {
    private final JdbcTemplate jdbcTemplate;
    
    @Autowired
    public ViewHistory(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    @GetMapping("/history/view/{username}")
    public ResponseEntity<List<Combo>> getHistoryItems(@PathVariable String username) {
        try {
            String sql = "SELECT * FROM combo WHERE seller = ? AND state = ?";
            List<Combo> combos = jdbcTemplate.query(sql, (resultSet, rowNum) -> {
                BeanPropertyRowMapper<Combo> rowMapper = new BeanPropertyRowMapper<>(Combo.class);
                return rowMapper.mapRow(resultSet, rowNum);
            }, username, true);
            return ResponseEntity.ok(combos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/history/viewdraft/{username}")
    public ResponseEntity<List<Combo>> getHistoryDraftItems(@PathVariable String username) {
        try {
            String sql = "SELECT * FROM combo WHERE seller = ? AND state = ?";
            List<Combo> combos = jdbcTemplate.query(sql, (resultSet, rowNum) -> {
                BeanPropertyRowMapper<Combo> rowMapper = new BeanPropertyRowMapper<>(Combo.class);
                return rowMapper.mapRow(resultSet, rowNum);
            }, username, false);
            return ResponseEntity.ok(combos);
        } catch (Exception e) {
            e.printStackTrace(); 
            System.out.printf("Errorhis",e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
