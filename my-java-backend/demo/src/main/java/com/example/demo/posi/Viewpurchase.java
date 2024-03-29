package com.example.demo.posi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class Viewpurchase {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public Viewpurchase(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/sellerview/{username}")
    public ResponseEntity<List<CartItem>> getHistoryItemsForAll(@PathVariable String username) {
        try {
            String sql = "SELECT * FROM cart WHERE seller = ? AND state = ?";
            List<CartItem> cartItems = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(CartItem.class), username, true);

            return ResponseEntity.ok(cartItems);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
