package com.example.demo.History;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.web.bind.annotation.*;
@RequestMapping("/api")
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class HistoryRepeat {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public HistoryRepeat(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    @PostMapping("/repeatHistory/{id}")
    public ResponseEntity<String> transferFromHistory(@PathVariable long id) {
        try {
            String selectHistorySql = "SELECT * FROM history WHERE id = :id";
            MapSqlParameterSource historyParameters = new MapSqlParameterSource();
            historyParameters.addValue("id", id);

            HistoryItem historyItem = namedParameterJdbcTemplate.queryForObject(
                    selectHistorySql,
                    historyParameters,
                    new BeanPropertyRowMapper<>(HistoryItem.class));

            if (historyItem != null) {
                String selectComboSql = "SELECT stockcount FROM combo WHERE id = :comboId";
                MapSqlParameterSource comboParameters = new MapSqlParameterSource();
                comboParameters.addValue("comboId", historyItem.getCombo().getId());

                int stockCount = namedParameterJdbcTemplate.queryForObject(selectComboSql, comboParameters, Integer.class);
                if (stockCount >= historyItem.getCount()) {
                    String insertHistorySql = "INSERT INTO history (topic, description, cost, count, username, state, rating, url, person, seller, weekend,status) VALUES (:topic, :description, :cost, :count, :username, :state, :rating, :url, :person, :seller, :weekend,:status)";
                    namedParameterJdbcTemplate.update(insertHistorySql, getSqlParameterSource(historyItem));

                    if (stockCount - historyItem.getCount() == 0) {
                        String updateComboMessageSql = "UPDATE combo SET message = 'Out of stock' WHERE id = :comboId";
                        namedParameterJdbcTemplate.update(updateComboMessageSql, comboParameters);
                    }
                    

                    return ResponseEntity.ok("Record with ID " + id + " transferred from history to history.");
                } else {
                    return ResponseEntity.badRequest().body("Insufficient stock for the product with ID " + historyItem.getCombo().getId());
                }
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) { 
            System.out.println(e);
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    private MapSqlParameterSource getSqlParameterSource(HistoryItem historyItem) {
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("topic", historyItem.getTopic());
        parameters.addValue("description", historyItem.getDescription());
        parameters.addValue("cost", historyItem.getCost());
        parameters.addValue("count", historyItem.getCount());
        parameters.addValue("username", historyItem.getUsername());
        parameters.addValue("state", historyItem.getState());
        parameters.addValue("rating", historyItem.getRating());
        parameters.addValue("url", historyItem.getUrl());
        parameters.addValue("person", historyItem.getPerson());
        parameters.addValue("seller", historyItem.getSeller());
        parameters.addValue("weekend", historyItem.getWeekend());
        return parameters;
    }
}
