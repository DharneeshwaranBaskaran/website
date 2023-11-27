package com.example.demo.Access;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class accessdelete {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @DeleteMapping("/deleteaccess/{id}")
    public ResponseEntity<String> deleteAccessItem(@PathVariable Long id) {
        try {
            // Define SQL query to delete a product from the access table based on its id
            String sql = "DELETE FROM access WHERE id=?";
            int rowsAffected = jdbcTemplate.update(sql, id);

            if (rowsAffected > 0) {
                System.out.println("Product deleted successfully: " + id);
                return ResponseEntity.ok("Product deleted successfully: " + id);
            } else {
                System.out.println("No product found with id: " + id);
                return ResponseEntity.badRequest().body("No product found with id: " + id);
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e);
            return ResponseEntity.status(500).body("Error deleting product");
        }
    }
}
