package com.example.demo.buynow;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
public class laterpayment{

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public laterpayment(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/paidlater/{username}/{id}")
    public ResponseEntity<String> transferCartToHistory(@PathVariable String username, @PathVariable Long id) {
        String updateSql = "UPDATE paylater SET state = ? WHERE username = ? AND id=?";
        int rowsAffected = jdbcTemplate.update(updateSql, false, username, id);

        if (rowsAffected > 0) {
            System.out.println("Payment status updated successfully");
            return ResponseEntity.ok("Payment status updated successfully");
        } else {
            System.out.println("No records updated");
            return ResponseEntity.ok("No records updated");
        }
    }
}
