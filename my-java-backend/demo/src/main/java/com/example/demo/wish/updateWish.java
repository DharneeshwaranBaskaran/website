package com.example.demo.wish;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class updateWish {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public updateWish(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/update/wish/{id}/{username}")
    public ResponseEntity<String> updateWishCount( @PathVariable Long id, @RequestBody wishlist cartItem,  @PathVariable String username
    ) {
        int count = cartItem.getCount();
        Boolean state = true;

        try {
            String selectSql = "SELECT count FROM wish WHERE combo_id = ? AND username = ? AND state = ?";
            Integer currentCount = jdbcTemplate.queryForObject(
                    selectSql,
                    Integer.class,
                    id,
                    username,
                    state
            );

            if (currentCount != null) {
                int newCount = currentCount + count;
                String updateSql = "UPDATE wish SET count = ? WHERE combo_id = ? AND username = ? AND state = ?";
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
                System.out.println("No product found with name: " + id);
                return ResponseEntity.badRequest().body("No product found with name: " + id);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating product count");
        }
    }
}
