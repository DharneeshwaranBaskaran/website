package com.example.demo.combo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.web.bind.annotation.*;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class comboprint {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public comboprint(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/combo/{person}")
    public ResponseEntity<List<Combo>> getComboByPerson(@PathVariable String person) {
        try {
            String sql = "SELECT * FROM combo WHERE person = ? AND state = ?";
            List<Combo> combos = jdbcTemplate.query(sql, new Object[]{person, true}, new ComboRowMapper());

            return ResponseEntity.ok(combos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private static class ComboRowMapper implements RowMapper<Combo> {
        @Override
        public Combo mapRow(ResultSet resultSet, int rowNum) throws SQLException {
            Combo combo = new Combo();
            combo.setId(resultSet.getLong("id"));
            combo.setTopic(resultSet.getString("topic"));
            combo.setRating(resultSet.getDouble("rating"));
            combo.setDescription(resultSet.getString("description"));
            combo.setUrl(resultSet.getString("url"));
            combo.setCost(resultSet.getInt("cost"));
            combo.setCat(resultSet.getString("cat"));
            combo.setPerson(resultSet.getString("person"));
            combo.setCount(resultSet.getInt("count"));
            combo.setStockcount(resultSet.getInt("stockcount"));
            return combo;
        }
    }
}
