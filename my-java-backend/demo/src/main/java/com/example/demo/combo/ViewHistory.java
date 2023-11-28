package com.example.demo.combo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;

@Controller
@RequestMapping("/api/history")
@CrossOrigin(origins = "http://localhost:3000")
public class ViewHistory {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ViewHistory(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/view/{username}")
    public ResponseEntity<List<Combo>> getHistoryItems(@PathVariable String username) {
        try {
            String sql = "SELECT * FROM combo WHERE seller = ? AND state = ?";
            List<Combo> combos = jdbcTemplate.query(sql, (resultSet, rowNum) -> {
                Combo combo = new Combo();
                combo.setId(resultSet.getLong("id"));
                combo.setTopic(resultSet.getString("topic"));
                combo.setRating(resultSet.getDouble("rating"));
                combo.setDescription(resultSet.getString("description"));
                combo.setUrl(resultSet.getString("url"));
                combo.setCost(resultSet.getInt("cost"));
                combo.setCount(resultSet.getInt("count"));
                combo.setCat(resultSet.getString("cat"));
                combo.setPerson(resultSet.getString("person"));
                combo.setStockcount(resultSet.getInt("stockcount"));
                return combo;
            }, username, true);

            return ResponseEntity.ok(combos);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/viewdraft/{username}")
    public ResponseEntity<List<Combo>> getHistoryDraftItems(@PathVariable String username) {
        try {
            String sql = "SELECT * FROM combo WHERE seller = ? AND state = ?";
            List<Combo> combos = jdbcTemplate.query(sql, (resultSet, rowNum) -> {
                Combo combo = new Combo();
                combo.setId(resultSet.getLong("id"));
                combo.setTopic(resultSet.getString("topic"));
                combo.setRating(resultSet.getDouble("rating"));
                combo.setDescription(resultSet.getString("description"));
                combo.setUrl(resultSet.getString("url"));
                combo.setCost(resultSet.getInt("cost"));
                combo.setCount(resultSet.getInt("count"));
                combo.setCat(resultSet.getString("cat"));
                combo.setPerson(resultSet.getString("person"));
                return combo;
            }, username, false);

            return ResponseEntity.ok(combos);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
