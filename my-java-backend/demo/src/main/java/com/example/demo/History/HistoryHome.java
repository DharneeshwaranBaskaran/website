package com.example.demo.History;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.web.bind.annotation.*;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class HistoryHome {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/historyhome/{username}")
    public ResponseEntity<List<HistoryItem>> getHistoryItemsForUsername(@PathVariable String username) {
        String sql = "SELECT * FROM history WHERE username = ?";
        List<HistoryItem> historyItems = jdbcTemplate.query(sql, new Object[]{username}, new HistoryItemRowMapper());

        return ResponseEntity.ok(historyItems);
    }

    private static class HistoryItemRowMapper implements RowMapper<HistoryItem> {
    @Override
    public HistoryItem mapRow(ResultSet resultSet, int rowNum) throws SQLException {
        BeanPropertyRowMapper<HistoryItem> rowMapper = new BeanPropertyRowMapper<>(HistoryItem.class);
        HistoryItem historyItem = rowMapper.mapRow(resultSet, rowNum);

        // Set the comboId from the resultSet
        historyItem.setId(resultSet.getLong("combo_id"));

        return historyItem;
    }
}

}
