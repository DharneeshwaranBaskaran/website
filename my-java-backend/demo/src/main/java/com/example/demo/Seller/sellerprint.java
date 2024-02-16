package com.example.demo.Seller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Controller
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class sellerprint {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public sellerprint(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/getperson/{username}")
    public ResponseEntity<List<SellerInfo>> getSellerInfoForUsername(@PathVariable String username) {
        try {
            String sql = "SELECT * FROM seller WHERE username = ?";
            List<SellerInfo> sellerInfos = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(SellerInfo.class), username);

            return ResponseEntity.ok(sellerInfos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
