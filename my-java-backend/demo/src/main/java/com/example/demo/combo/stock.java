package com.example.demo.combo;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class stock{

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public stock(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/updatestock/{id}/{number}/{topic}")
    public ResponseEntity<String> updateStockCount(@PathVariable Long id, @PathVariable Integer number, @PathVariable String topic) {
        try {
            String selectSql = "SELECT count,stockcount FROM combo WHERE id=?";
            Map<String, Object> comboData = jdbcTemplate.queryForMap(selectSql, id);
            int currentCount = (int) comboData.get("count");
            int currentStockCount = (int) comboData.get("stockcount");
            if (currentStockCount == 0) {
                String updateReminderSql = "UPDATE reminder SET state = ? WHERE topic=?";
                jdbcTemplate.update(updateReminderSql, true, topic);
            }

            int newCount = currentStockCount + number;

            String updateSql = "UPDATE combo SET stockcount = ?,message=? WHERE id=?";
            int rowsAffected = jdbcTemplate.update(updateSql, newCount, (currentCount == 0) ? "10% Discount":"",id  );

            if (rowsAffected > 0) {
                System.out.println("Count updated successfully for product: " + id);
                return ResponseEntity.ok().body("{\"message\": \"Count updated successfully for product: " + id + "\"}");
            } else {
                System.out.println("No product found with id: " + id);
                return ResponseEntity.badRequest().body("No product found with id: " + id);
            }
        } catch (Exception e) {
            System.out.println("Error updating stock count: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error: " + e.getMessage());
        }
    }
}
