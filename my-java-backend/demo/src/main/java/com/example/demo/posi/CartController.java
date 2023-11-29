package com.example.demo.posi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public CartController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addItemToCart(@RequestBody CartItem cartItem) {
        try {
            Long id = cartItem.getId();
            int count = cartItem.getCount();

            if (!hasEnoughStock(id, count)) {
                return ResponseEntity.badRequest().body("Stock count is less than the requested count.");
            }
            int lastId = jdbcTemplate.queryForObject("SELECT MAX(id) FROM cart", Integer.class);

            int newId = lastId + 1;

            String insertCartSql = "INSERT INTO cart (cost, count, topic, description, username, state, rating, url, person, seller, combo_id, weekend) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            int rowsAffected = jdbcTemplate.update(
                    insertCartSql,
                    cartItem.getCost(),
                    cartItem.getCount(),
                    cartItem.getTopic(),
                    cartItem.getDescription(),
                    cartItem.getUsername(),
                    true,
                    cartItem.getRating(),
                    cartItem.getUrl(),
                    cartItem.getPerson(),
                    cartItem.getSeller(),
                    id,
                    cartItem.getWeekend()
            );

            if (rowsAffected > 0) {
                String updateComboSql = "UPDATE combo SET cart_item_id = ? WHERE id = ?";
                jdbcTemplate.update(updateComboSql, newId, id);

                return ResponseEntity.ok("Data inserted successfully");
            } else {
                return ResponseEntity.badRequest().body("Data insertion failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Data insertion failed");
        }
    }

    private boolean hasEnoughStock(Long comboId, int requestedCount) {
        String selectComboStockSql = "SELECT stockcount FROM combo WHERE id = ?";
        Integer stockCount = jdbcTemplate.queryForObject(selectComboStockSql, Integer.class, comboId);

        return stockCount != null && stockCount >= requestedCount;
    }
}
