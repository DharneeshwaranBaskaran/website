package com.example.demo.loginregister;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class userprint {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/user/{username}")
    public ResponseEntity<List<User>> getUserByUsername(@PathVariable String username) {
        try {
            String sql = "SELECT * FROM users WHERE username = ?";
            List<User> users = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(User.class), username);
            
            if (!users.isEmpty()) {
                return ResponseEntity.ok(users);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
