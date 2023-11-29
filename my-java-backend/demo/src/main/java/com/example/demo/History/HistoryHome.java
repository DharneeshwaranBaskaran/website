package com.example.demo.History;

import org.springframework.beans.factory.annotation.Autowired;
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
            HistoryItem historyItem = new HistoryItem();
            historyItem.setId(resultSet.getLong("combo_id"));
            historyItem.setTopic(resultSet.getString("topic"));
            historyItem.setDescription(resultSet.getString("description"));
            historyItem.setCost(resultSet.getDouble("cost"));
            historyItem.setCount(resultSet.getInt("count"));
            historyItem.setUsername(resultSet.getString("username"));
            historyItem.setState(resultSet.getBoolean("state"));
            historyItem.setRating(resultSet.getDouble("rating"));
            historyItem.setUrl(resultSet.getString("url"));
            historyItem.setPerson(resultSet.getString("person"));
            historyItem.setSeller(resultSet.getString("seller"));
            return historyItem;
        }
    }
}
