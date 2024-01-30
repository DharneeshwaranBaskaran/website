package com.example.demo.buynow;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
public class paylaterprint {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public paylaterprint(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/paylater/getpaylater/{username}")
    public ResponseEntity<List<paylater>> getCartItemsForUsername(@PathVariable String username) {
        try {
            String sql = "SELECT * FROM paylater WHERE username = ? AND state = ?";
        List<paylater> cartItems = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(paylater.class), username, true);

        return ResponseEntity.ok(cartItems);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/getpaylat/{id}")
    public ResponseEntity<List<paylater>> getCartItemsForId(@PathVariable Long id) {
        try {
            String sql = "SELECT * FROM paylater WHERE id=?";
        List<paylater> cartItems = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(paylater.class), id);

        return ResponseEntity.ok(cartItems);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
