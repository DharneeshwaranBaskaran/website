package com.example.demo.wish;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class printwish {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public printwish(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/wishlist/{username}")
    public ResponseEntity<List<wishlist>> getWishItemsForUsername(@PathVariable String username) {
        try {
            String sql = "SELECT * FROM wish WHERE username = ? AND state = ?";
            List<wishlist> wishItems = jdbcTemplate.query(
                    sql,
                    new BeanPropertyRowMapper<>(wishlist.class),
                    username,
                    true
            );

            return ResponseEntity.ok(wishItems);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
