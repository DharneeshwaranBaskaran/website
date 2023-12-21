package com.example.demo.wish;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/wish")
@CrossOrigin(origins = "http://localhost:3000")
public class addwish {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public addwish(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addItemToWish(@RequestBody wishlist cartItem) {

        Long comboId = cartItem.getId();
        if (comboId == null) {
            return ResponseEntity.badRequest().body("Combo with topic not found");
        }

        String sql = "INSERT INTO wish (cost, count, topic, description, username, state, rating, url, person, seller, weekend, combo_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";

        try {
            int rowsAffected = jdbcTemplate.update(
                    sql,
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
                    cartItem.getWeekend(),
                    comboId
            );

            if (rowsAffected > 0) {
                System.out.println("Data inserted successfully.");
                System.out.println(cartItem.getSeller());
                return ResponseEntity.ok("Data inserted successfully");
            } else {
                System.out.println("Data insertion failed.");
                return ResponseEntity.badRequest().body("Data insertion failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Data insertion failed");
        }
    }

}
