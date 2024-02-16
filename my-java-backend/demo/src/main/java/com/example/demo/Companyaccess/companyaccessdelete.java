package com.example.demo.Companyaccess;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class companyaccessdelete {

    private final JdbcTemplate jdbcTemplate;

    public companyaccessdelete(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @DeleteMapping("/deletecompanyaccess/{id}")
    public ResponseEntity<String> deleteAccessItem(@PathVariable Long id) {
        try {
            String sql = "DELETE FROM companyaccess WHERE id=?";
            int rowsAffected = jdbcTemplate.update(sql, id);

            if (rowsAffected > 0) {
                System.out.println("Item deleted successfully: " + id);
                return ResponseEntity.ok("Item deleted successfully: " + id);
            } else {
                System.out.println("No item found with id: " + id);
                return ResponseEntity.badRequest().body("No item found with id: " + id);
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e);
            return ResponseEntity.status(500).body("Error deleting item");
        }
    }
}
