package com.example.demo.combo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
public class ComboDelete {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ComboDelete(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @DeleteMapping("/deletecombo/{id}/{Username}")
    public ResponseEntity<String> deleteComboItem(@PathVariable Long id, @PathVariable String Username) {
        try {
            String sql = "DELETE FROM combo WHERE id = ? AND seller = ?";
            int rowsAffected = jdbcTemplate.update(sql, id, Username);

            if (rowsAffected > 0) {
                System.out.println("Product deleted successfully: " + id);
                return ResponseEntity.ok("Product deleted successfully: " + id);
            } else {
                System.out.println("No product found with name: " + id);
                return ResponseEntity.badRequest().body("No product found with name: " + id);
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e);
            return ResponseEntity.status(500).body("Error deleting product");
        }
    }
}
