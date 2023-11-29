package com.example.demo.posi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class cartUpdate {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public cartUpdate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/update/cart/{id}/{username}")
    public ResponseEntity<String> updateCart(@PathVariable Long id, @RequestBody CartItem cartItem, @PathVariable String username) {
        int count = cartItem.getCount();
        boolean state = true;

        try {
            String selectSql = "SELECT count FROM cart WHERE combo_id = ? AND username = ? AND state = ?";
            Integer currentCount = jdbcTemplate.queryForObject(
                    selectSql,
                    Integer.class,
                    id,
                    username,
                    state
            );

            if (currentCount != null) {
                int newCount = currentCount + count;

                String stockCountSql = "SELECT stockcount FROM combo WHERE id = ?";
                Integer stockCount = jdbcTemplate.queryForObject(
                        stockCountSql,
                        Integer.class,
                        id
                );

                if (stockCount != null && stockCount >= newCount) {
                    String updateSql = "UPDATE cart SET count = ? WHERE combo_id = ? AND username = ? AND state = ?";
                    int rowsAffected = jdbcTemplate.update(
                            updateSql,
                            newCount,
                            id,
                            username,
                            state
                    );

                    if (rowsAffected > 0) {
                        System.out.println("Count updated successfully for product: " + id);
                        return ResponseEntity.ok("Count updated successfully for product: " + id);
                    } else {
                        System.out.println("No product found with name: " + id);
                        return ResponseEntity.badRequest().body("No product found with name: " + id);
                    }
                } else {
                    return ResponseEntity.badRequest().body("Stock count is less than the requested count.");
                }
            } else {
                System.out.println("No product found with name: " + id);
                return ResponseEntity.badRequest().body("No product found with name: " + id);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating product count: " + e.getMessage());
        }
    }
}
